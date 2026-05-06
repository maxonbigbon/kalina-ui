import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { Injector, inject, Injectable } from "@angular/core";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";

import { KN_BOTTOM_SHEET_DEFAULT_CONFIG, KN_BOTTOM_SHEET_OUTSIDE_CONTEXT, KnBottomSheetConfig, KnBottomSheetDefaultConfig } from "../types";
import { KnBottomSheetRef } from "../common/bottom-sheet-ref";

@Injectable({ providedIn: 'root' })
export class KnBottomSheetService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private activeRefs = new Map<string, KnBottomSheetRef>();
  private defaultConfig = inject(KN_BOTTOM_SHEET_DEFAULT_CONFIG, { optional: true });

  open<T = any>(
    componentOrTemplate: ComponentType<T> | TemplatePortal<any>,
    config: KnBottomSheetConfig = {},
  ): KnBottomSheetRef {
    const mergedConfig: Partial<KnBottomSheetDefaultConfig> & KnBottomSheetConfig = {
      ...(this.defaultConfig ?? {}),
      ...config,
    };

    const id = mergedConfig.id || `sheet_${Date.now()}`;

    // Если уже открыт — закрываем
    this.close(id);

    const overlayRef = this.overlay.create({
      hasBackdrop: mergedConfig.hasBackdrop,
      backdropClass: ['kn-bottom-sheet-backdrop', mergedConfig.backdropClass || ''],
      panelClass: ['kn-bottom-sheet-panel', mergedConfig.panelClass || ''],
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('0'),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
    });

    if (componentOrTemplate instanceof TemplatePortal) {
      overlayRef.attach(componentOrTemplate);
      // при открытии из компонента, props не прокидываем, т.к. они уже в @Input
    } else {
      const customInjector = Injector.create({
        providers: [
          { provide: KN_BOTTOM_SHEET_OUTSIDE_CONTEXT, useValue: {
            ...mergedConfig,
            isOutsideCreation: true,
            id,
          }},
        ],
        parent: this.injector,
      });
      const portal = new ComponentPortal(componentOrTemplate, null, customInjector);
      overlayRef.attach<any>(portal);
    }

    const bottomSheetRef = new KnBottomSheetRef(overlayRef, id, this);
    this.activeRefs.set(id, bottomSheetRef);

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