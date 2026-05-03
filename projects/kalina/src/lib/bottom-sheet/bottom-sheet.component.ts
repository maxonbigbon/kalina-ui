import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'kn-bottom-sheet',
  imports: [],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetComponent implements AfterViewInit {
  private el = inject(ElementRef);

  // Входные параметры
  @Input() minHeight = 120;
  @Input() defaultHeight = 400;
  @Input() maxHeight = 0; // 0 = auto (viewport - offset)
  @Input() showOverlay = true;
  @Input() showHandle = true;

  // Выходные события
  @Output() dismiss = new EventEmitter<void>();
  @Output() heightChange = new EventEmitter<number>();

  @ViewChild('sheet') sheetRef!: ElementRef<HTMLDivElement>;
  @ViewChild('content') contentRef!: ElementRef<HTMLDivElement>;

  isOpen = signal(true);
  currentHeight = signal(0);

  private startY = 0;
  private startHeight = 0;
  private isDragging = false;
  private rafId: number | null = null;
  private velocity = 0;
  private lastY = 0;
  private lastTime = 0;

  ngAfterViewInit() {
    this.currentHeight.set(this.defaultHeight);
    this.applyHeight(this.defaultHeight);
  }

  private applyHeight(height: number) {
    const sheet = this.sheetRef.nativeElement;
    const max = this.maxHeight || window.innerHeight * 0.9;
    const clamped = Math.max(this.minHeight, Math.min(max, height));
    
    sheet.style.height = `${clamped}px`;
    this.currentHeight.set(clamped);
    this.heightChange.emit(clamped);
  }

  // ==================== DRAG LOGIC ====================

  onTouchStart(e: TouchEvent) {
    this.startDrag(e.touches[0].pageY);
  }

  onMouseDown(e: MouseEvent) {
    this.startDrag(e.pageY);
  }

  private startDrag(pageY: number) {
    this.isDragging = true;
    this.startY = pageY;
    this.startHeight = this.currentHeight();
    this.lastY = pageY;
    this.lastTime = Date.now();
    this.velocity = 0;
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.handleMove(e.touches[0].pageY);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.handleMove(e.pageY);
  }

  private handleMove(pageY: number) {
    const delta = pageY - this.startY;
    let newHeight = this.startHeight - delta;

    // Простая velocity для инерции
    const now = Date.now();
    this.velocity = (pageY - this.lastY) / (now - this.lastTime + 1);
    this.lastY = pageY;
    this.lastTime = now;

    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.rafId = requestAnimationFrame(() => {
      this.applyHeight(newHeight);
    });
  }

  onTouchEnd = () => this.endDrag();
  onMouseUp = () => this.endDrag();

  private endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const current = this.currentHeight();
    const max = this.maxHeight || window.innerHeight * 0.9;

    // Логика snap + dismiss
    if (current < this.minHeight * 1.5 && this.velocity < -0.5) {
      this.close();
      return;
    }

    let targetHeight: number;

    if (current > max * 0.7) {
      targetHeight = max;           // открыть полностью
    } else if (current > this.minHeight * 1.8) {
      targetHeight = this.defaultHeight; // среднее положение
    } else {
      targetHeight = this.minHeight;    // минимальное
      if (current < this.minHeight * 1.2) this.close();
    }

    this.animateToHeight(targetHeight);
  }

  private animateToHeight(target: number) {
    const start = this.currentHeight();
    const duration = 280;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const height = start + (target - start) * ease;
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
    this.isOpen.set(false);
    this.dismiss.emit();
  }

  ngOnDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

