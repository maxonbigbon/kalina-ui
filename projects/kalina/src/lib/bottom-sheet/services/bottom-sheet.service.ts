import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { ComponentRef, inject, Injectable, TemplateRef } from "@angular/core";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";

import { KnBottomSheetConfig } from "../types";
import { KnBottomSheetRef } from "../common/bottom-sheet-ref";

@Injectable({ providedIn: 'root' })
export class KnBottomSheetService {
  private overlay = inject(Overlay);
  private activeRefs = new Map<string, KnBottomSheetRef>();

  open<T = any>(
    componentOrTemplate: ComponentType<T> | TemplateRef<any>,
    config: KnBottomSheetConfig = {}
  ): KnBottomSheetRef {
    const id = config.id || `sheet_${Date.now()}`;

    // Если уже открыт — закрываем
    this.close(id);

    const overlayRef = this.overlay.create({
      hasBackdrop: config.hasBackdrop,
      backdropClass: ['kn-bottom-sheet-backdrop', config.backdropClass || ''],
      panelClass: ['kn-bottom-sheet-panel', config.panelClass || ''],
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('0'),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
    });

    let componentRef: ComponentRef<any>;

    if (componentOrTemplate instanceof TemplateRef || componentOrTemplate instanceof TemplatePortal) {
      componentRef = overlayRef.attach(componentOrTemplate);
    } else {
      const portal = new ComponentPortal(componentOrTemplate);
      componentRef = overlayRef.attach(portal);
    }

    const bottomSheetRef = new KnBottomSheetRef(overlayRef, id, this);
    this.activeRefs.set(id, bottomSheetRef);

    // Передаём props в компонент
    if (componentRef.instance) {
      componentRef.instance.id = id;
      componentRef.instance.hasHandleIcon = config.hasHandleIcon;
      componentRef.instance.hasCloseIcon = config.hasCloseIcon;
      componentRef.instance.data = config.data;
      componentRef.instance.defaultHeight = config.defaultHeight;
      componentRef.instance.minHeight = config.minHeight;
      componentRef.instance.maxHeight = config.maxHeight;
      componentRef.changeDetectorRef.detectChanges();
    }

    return bottomSheetRef;
  }

  close(id?: string, result?: any) {
    if (id) {
      const ref = this.activeRefs.get(id);
      ref?.close(result);
      this.activeRefs.delete(id);
    } else {
      // закрыть последний
      const lastRef = Array.from(this.activeRefs.values()).pop();
      lastRef?.close(result);
    }
  }
}