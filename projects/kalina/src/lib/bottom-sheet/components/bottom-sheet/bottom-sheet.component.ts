import { OnInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, signal, ViewChild, TemplateRef, ViewContainerRef, SimpleChanges, OnChanges } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';

import { KnBottomSheetService } from '../../services/bottom-sheet.service';
import { KnBottomSheetRef } from '../../common/bottom-sheet-ref';

@Component({
  selector: 'kn-bottom-sheet',
  imports: [NgTemplateOutlet],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetComponent implements OnInit, OnDestroy, OnChanges {
  private service = inject(KnBottomSheetService);
  private viewContainerRef = inject(ViewContainerRef);
  
  // Входные параметры
  @Input() id!: string;
  @Input() hasBackdrop = true;
  @Input() hasHandleIcon = true;
  @Input() hasCloseIcon = true;
  @Input() backdropClass = '';
  @Input() panelClass = '';
  @Input() data: any = null;
  @Input() defaultHeight = 400;
  @Input() minHeight = 120;
  @Input() maxHeight = 0; // 0 = auto (viewport - offset)
  @Input() isOpen = false;
  
  
  // Выходные события
  @Output() heightChange = new EventEmitter<number>();
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<any>();
  
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
  @ViewChild('sheet') sheetRef!: ElementRef<HTMLDivElement>;
  currentHeight = signal(0);

  private startY = 0;
  private startHeight = 0;
  private isDragging = false;
  private rafId: number | null = null;
  private velocity = 0;
  private lastY = 0;
  private lastTime = 0;

  private currentRef: KnBottomSheetRef | null = null;
  private portal!: TemplatePortal<any>;

  ngOnInit(): void {
    if (!this.id) {
      console.warn('[kn-bottom-sheet] Attribute [id] is requred');
    }
    // Создаём портал один раз
    this.portal = new TemplatePortal(this.contentTemplate, this.viewContainerRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen && !this.currentRef) {
        this.open();
      } else if (!this.isOpen && this.currentRef) {
        this.currentRef.close();
      }
    }
  }

  ngOnDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.close();
  }

  public open() {
    if (!this.portal) return;

    this.currentRef = this.service.open(this.portal as unknown as TemplateRef<any>, {
      id: this.id,
      hasBackdrop: this.hasBackdrop,
      backdropClass: this.backdropClass,
      panelClass: this.panelClass,
      data: this.data,
      defaultHeight: this.defaultHeight,
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
    });

    this.currentRef.afterClosed$.subscribe((result) => {
      this.isOpen = false;
      this.isOpenChange.emit(false);
      this.closed.emit(result);
      this.currentRef = null;
    });
  }

  public close(): void {
    this.currentRef?.close();
  }

  // ==================== DRAG LOGIC ====================

  public onTouchStart(e: TouchEvent) {
    this.startDrag(e.touches[0].pageY);
  }

  public onMouseDown(e: MouseEvent) {
    this.startDrag(e.pageY);
  }

  public onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.handleMove(e.touches[0].pageY);
  }

  public onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.handleMove(e.pageY);
  }

  public onTouchEnd = () => this.endDrag();
  public onMouseUp = () => this.endDrag();

  private startDrag(pageY: number) {
    this.isDragging = true;
    this.startY = pageY;
    this.startHeight = this.currentHeight();
    this.lastY = pageY;
    this.lastTime = Date.now();
    this.velocity = 0;
  }

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

  private applyHeight(height: number) {
    const sheet = this.sheetRef.nativeElement;
    const max = this.maxHeight || window.innerHeight * 0.9;
    const clamped = Math.max(this.minHeight, Math.min(max, height));
    
    sheet.style.height = `${clamped}px`;
    this.currentHeight.set(clamped);
    this.heightChange.emit(clamped);
  }
}

