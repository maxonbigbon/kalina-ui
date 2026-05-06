import { OnInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, signal, ViewChild, TemplateRef, ViewContainerRef, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';

import { KnBottomSheetService } from '../../services/bottom-sheet.service';
import { KnBottomSheetRef } from '../../common/bottom-sheet-ref';
import { KN_BOTTOM_SHEET_DEFAULT_CONFIG, KN_BOTTOM_SHEET_OUTSIDE_CONTEXT, KnBottomSheetConfig, KnBottomSheetDefaultConfig } from '../../types';

@Component({
  selector: 'kn-bottom-sheet',
  imports: [NgTemplateOutlet],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private service = inject(KnBottomSheetService);
  private viewContainerRef = inject(ViewContainerRef);
  private bottomSheetDefaultConfig = inject(KN_BOTTOM_SHEET_DEFAULT_CONFIG, { optional: true });
  private bottomSheetOutsideContext = inject(KN_BOTTOM_SHEET_OUTSIDE_CONTEXT);
  
  // Входные параметры
  @Input() id = window.crypto.randomUUID();
  @Input() hasBackdrop = true;
  @Input() hasHandleIcon = true;
  @Input() hasCloseIcon = true;
  @Input() backdropClass = '';
  @Input() panelClass = '';
  @Input() data: any = null;
  @Input() defaultHeight = 0;
  @Input() minHeight = 0;
  @Input() maxHeight = window.innerHeight * 0.9;
  @Input() isOpen = false;
  
  // Выходные события
  @Output() heightChange = new EventEmitter<number>();
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<any>();
  
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
  @ViewChild('sheet') sheetRef!: ElementRef<HTMLDivElement>;
  @ViewChild('content') contentRef!: ElementRef<HTMLDivElement>;
  currentHeight = signal(0);

  private startY = 0;
  private startHeight = 0;
  private isDragging = false;
  private rafId: number | null = null;
  private lastY = 0;
  private lastTime = 0;
  private velocityY = 0; // px/ms, + вниз, - вверх
  private hasDragged = false; // аналог w.current из референса
  private startedFromContent = false;

  private currentRef: KnBottomSheetRef | null = null;
  private portal!: TemplatePortal<any>;

  get knOutsideCreation(): boolean {
    return this.bottomSheetOutsideContext?.isOutsideCreation;
  }

  get knData(): any {
    return this.data || this.bottomSheetOutsideContext?.data || null;
  }

  get knId(): string {
    return this.bottomSheetOutsideContext?.id || this.id;
  }

  ngOnInit(): void {
    // Создаём портал один раз
    this.portal = new TemplatePortal(this.contentTemplate, this.viewContainerRef);
  }

  ngAfterViewInit(): void {
    // Начальная высота, чтобы первый drag не "прыгал" с 0
    this.defaultHeight = this.defaultHeight || this.sheetRef.nativeElement.clientHeight;
    this.applyHeight(this.defaultHeight);
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
    this.detachGlobalDragListeners();
    this.close();
  }

  public open() {
    if (!this.portal) return;

    const config = {
      hasBackdrop: this.hasBackdrop,
      backdropClass: this.backdropClass,
      panelClass: this.panelClass,
      data: this.data,
      hasHandleIcon: this.hasHandleIcon,
      hasCloseIcon: this.hasCloseIcon,
      defaultHeight: this.defaultHeight,
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
    };

    const mergedConfig: Partial<KnBottomSheetDefaultConfig> & KnBottomSheetConfig = {
      ...(this.bottomSheetDefaultConfig ?? {}),
      ...config,
    };

    this.currentRef = this.service.open(this.portal, {
      id: this.id,
      ...mergedConfig,
    });

    this.currentRef.afterClosed$.subscribe((result) => {
      this.isOpen = false;
      this.isOpenChange.emit(false);
      this.closed.emit(result);
      this.currentRef = null;
    });
  }

  public close(): void {
    this.service.close(this.knId);
  }

  // ==================== DRAG LOGIC ====================

  public onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    this.startDrag(e.touches[0].pageY, e.target);
  }

  public onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.startDrag(e.pageY, e.target);
  }

  private startDrag(pageY: number, target: EventTarget | null) {
    if (!this.sheetRef?.nativeElement) return;
    this.isDragging = true;
    this.startY = pageY;
    this.startHeight = this.currentHeight();
    this.lastY = pageY;
    this.lastTime = Date.now();
    this.velocityY = 0;
    this.hasDragged = false;
    this.startedFromContent = this.isTargetInsideContent(target);
    this.attachGlobalDragListeners();
  }

  private endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.detachGlobalDragListeners();

    const current = this.currentHeight();
    const max = this.maxHeight;

    // Логика snap + dismiss
    // Быстрый свайп вниз или сильное уменьшение -> закрыть (как onDismiss в референсе)
    const dismissVelocity = 0.3; // px/ms
    console.log(this.velocityY, dismissVelocity);
    if (current < this.minHeight * 1.2 || (this.velocityY > dismissVelocity || !this.hasDragged)) {
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
    }

    this.animateToHeight(targetHeight);
  }

  private handleMove(pageY: number) {
    const deltaY = pageY - this.startY;
    if (!this.hasDragged) {
      // порог начала как в референсе: сначала отличаем "tap" от drag
      this.hasDragged = Math.abs(deltaY) > 1;
      if (!this.hasDragged) return;
    }

    // Если жест начался внутри контента и контент проскроллен, не перетаскиваем шторку вниз
    // пока пользователь не доскроллит до верха (поведение как isContentScrolledRef в референсе).
    if (this.startedFromContent && this.isContentScrolled() && deltaY > 0) {
      return;
    }

    const newHeight = this.startHeight - deltaY;

    // velocity по Y (px/ms), + вниз, - вверх
    const now = Date.now();
    this.velocityY = (pageY - this.lastY) / (now - this.lastTime + 1);
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
    const clamped = this.clampHeight(height);
    
    sheet.style.height = `${clamped}px`;
    this.currentHeight.set(clamped);
    this.heightChange.emit(clamped);
  }

  private clampHeight(height: number): number {
    return Math.max(this.minHeight, Math.min(this.maxHeight, height));
  }

  private isTargetInsideContent(target: EventTarget | null): boolean {
    const el = target as Node | null;
    const content = this.contentRef?.nativeElement;
    if (!el || !content) return false;
    return content.contains(el);
  }

  private isContentScrolled(): boolean {
    const content = this.contentRef?.nativeElement;
    return !!content && content.scrollTop > 0;
  }

  // Глобальные слушатели, чтобы drag не обрывался при уходе курсора/пальца за пределы sheet
  private boundOnMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    this.handleMove(e.pageY);
  };

  private boundOnMouseUp = () => this.endDrag();

  private boundOnTouchMove = (e: TouchEvent) => {
    if (!this.isDragging) return;
    if (e.touches.length !== 1) return;
    // критично: passive:false, иначе preventDefault игнорируется и страница/контент может скроллиться
    e.preventDefault();
    this.handleMove(e.touches[0].pageY);
  };

  private boundOnTouchEnd = () => this.endDrag();

  private attachGlobalDragListeners() {
    window.addEventListener('mousemove', this.boundOnMouseMove);
    window.addEventListener('mouseup', this.boundOnMouseUp, { once: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundOnTouchEnd, { once: true });
    window.addEventListener('touchcancel', this.boundOnTouchEnd, { once: true });
  }

  private detachGlobalDragListeners() {
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchEnd);
    window.removeEventListener('touchcancel', this.boundOnTouchEnd);
  }
}

