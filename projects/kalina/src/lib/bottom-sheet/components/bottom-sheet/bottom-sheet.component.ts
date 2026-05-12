import { TemplatePortal } from "@angular/cdk/portal";
import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, signal, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

import { KnBottomSheetRef } from "../../common/bottom-sheet-ref";
import { KnBottomSheetService } from "../../services/bottom-sheet.service";
import { KN_BOTTOM_SHEET_DEFAULT_CONFIG, KN_BOTTOM_SHEET_OUTSIDE_CONTEXT, KnBottomSheetConfig, KnBottomSheetDefaultConfig } from "../../types";
import { KnBottomSheetCoreComponent } from "../bottom-sheet-core/bottom-sheet-core.component";

@Component({
    selector: 'kn-bottom-sheet',
    imports: [NgTemplateOutlet, KnBottomSheetCoreComponent],
    templateUrl: './bottom-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class KnBottomSheetComponent {
    private service = inject(KnBottomSheetService);
    private viewContainerRef = inject(ViewContainerRef);
    private bottomSheetDefaultConfig = inject(KN_BOTTOM_SHEET_DEFAULT_CONFIG, { optional: true });
    private bottomSheetOutsideContext = inject(KN_BOTTOM_SHEET_OUTSIDE_CONTEXT, { optional: true });
    
    // Входные параметры
    @Input() id = window.crypto.randomUUID();
    @Input() hasBackdrop = true;
    @Input() hasHandleIcon = true;
    @Input() hasCloseIcon = true;
    @Input() backdropClass = '';
    @Input() panelClass = '';
    @Input() data: any = null;
    @Input() defaultHeight = 0;
    @Input() minHeight = 100;
    @Input() maxHeight = window.innerHeight * 0.9;
    @Input() isOpen = false;
    
    @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
    currentHeight = signal(0);
  
    private currentRef: KnBottomSheetRef | null = null;
    private portal!: TemplatePortal<any>;
  
    get knOutsideCreation(): boolean {
      return this.bottomSheetOutsideContext?.isOutsideCreation || false;
    }
  
    get knData(): any {
      return this.data || this.bottomSheetOutsideContext?.data || null;
    }
  
    get knId(): string {
      return this.bottomSheetOutsideContext?.id || this.id;
    }
  
    ngOnInit(): void {
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
        this.currentRef = null;
      });
    }

    public close() {
      this.service.close(this.knId);
    }
  }