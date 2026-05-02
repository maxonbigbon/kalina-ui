import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'kn-bottom-sheet',
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetComponent implements AfterViewInit {
  private el = inject(ElementRef);

  @Input() minHeight = 120;
  @Input() defaultHeight = 420;
  @Input() maxHeightPercent = 90; // в процентах от viewport

  @Output() dismiss = new EventEmitter<void>();
  @Output() heightChange = new EventEmitter<number>();

  @ViewChild('sheetContainer') sheetContainer!: ElementRef<HTMLDivElement>;
  @ViewChild(CdkDrag) cdkDrag!: CdkDrag;

  currentHeight = 0;
  private maxHeight = 0;

  ngAfterViewInit(): void {
    this.maxHeight = window.innerHeight * (this.maxHeightPercent / 100);
    this.currentHeight = this.defaultHeight;
    this.applyHeight(this.defaultHeight);
  }

  private applyHeight(height: number) {
    const clamped = Math.max(this.minHeight, Math.min(this.maxHeight, height));
    this.sheetContainer.nativeElement.style.height = `${clamped}px`;
    this.currentHeight = clamped;
    this.heightChange.emit(clamped);
  }

  // Событие во время перетаскивания
  onDragMoved(event: CdkDragMove) {
    const currentTop = this.sheetContainer.nativeElement.getBoundingClientRect().top;
    const newHeight = window.innerHeight - currentTop;

    this.applyHeight(newHeight);
    // We use cdkDrag only to get pointer deltas; keep panel visually pinned to the bottom.
    event.source.reset();
  }

  // Завершение перетаскивания — snap логика
  onDragEnded(event: CdkDragEnd) {
    const velocity = event.source.getFreeDragPosition().y; // упрощённо
    const currentHeight = this.currentHeight;

    let targetHeight: number;

    if (currentHeight < this.minHeight * 1.6) {
      // Свайп вниз — закрыть
      if (currentHeight < this.minHeight * 1.3) {
        this.close();
        return;
      }
      targetHeight = this.minHeight;
    } 
    else if (currentHeight > this.maxHeight * 0.75) {
      targetHeight = this.maxHeight;        // полностью открыть
    } 
    else {
      targetHeight = this.defaultHeight;    // среднее положение
    }

    this.snapToHeight(targetHeight);
    event.source.reset();
  }

  private snapToHeight(target: number) {
    const start = this.currentHeight;
    const duration = 300;
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const height = Math.round(start + (target - start) * eased);
      this.applyHeight(height);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.applyHeight(target);
      }
    };

    requestAnimationFrame(animate);
  }

  close() {
    this.dismiss.emit();
  }
}

