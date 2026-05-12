import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { KnBottomSheetComponent, KnBottomSheetService } from "kalina";

import { BottomSheetViaServiceComponent } from "./bottom-sheet-via-service.component";

@Component({
  selector: 'kn-bottom-sheet-via-service-container',
  imports: [KnBottomSheetComponent],
  template: `
      <button type="button" class="demo-btn" (click)="openSheet()">Open</button>
    `,
  styles: `
      .demo-btn {
        appearance: none;
        border: 1px solid var(--kn-color-border);
        background: var(--kn-color-surface-2);
        color: var(--kn-color-text);
        border-radius: var(--kn-radius-md);
        padding: 8px 12px;
        cursor: pointer;
        width: fit-content;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetViaServiceContainerComponent {
  private bottomSheetService = inject(KnBottomSheetService);

  protected openSheet(): void {
    this.bottomSheetService.open(BottomSheetViaServiceComponent, { data: new Date().toDateString() });
  }
}