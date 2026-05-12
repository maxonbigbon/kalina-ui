import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCodeTab, DemoExampleBlockComponent } from '../../../../shared/demo-example-block/demo-example-block.component';
import { KnBottomSheetViaServiceContainerComponent } from './code/bottom-sheet-via-service-container.component';

@Component({
  selector: 'kn-bottom-sheet-via-service',
  imports: [DemoExampleBlockComponent, KnBottomSheetViaServiceContainerComponent],
  templateUrl: './bottom-sheet-via-service.component.html',
  styleUrl: './bottom-sheet-via-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetViaServiceComponent {
  protected readonly serviceExampleTabs: DemoCodeTab[] = [
    {
      label: 'container.component.ts',
      language: 'typescript',
      code: `
@Component({
  selector: 'kn-bottom-sheet-via-service-container',
  imports: [KnBottomSheetComponent],
  template: \`
      <button type="button" class="demo-btn" (click)="openSheet()">Open</button>
    \`,
  styles: \`
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
    \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetViaServiceContainerComponent {
  private bottomSheetService = inject(KnBottomSheetService);

  protected openSheet(): void {
    this.bottomSheetService.open(BottomSheetViaServiceComponent, { data: new Date().toDateString() });
  }
}
      `,
    },
    {
      label: 'bottom-sheet.component.html',
      language: 'html',
      code: `
<kn-bottom-sheet #bottomSheet>
  <div header class="sheet-header-demo">
    <h2 class="sheet-title">Title</h2>
    <p class="sheet-subtitle">Subtitle</p>
  </div>

  <div class="sheet-body sheet-body--text">
    <p>
      Today is {{ bottomSheet.knData }}!
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
      aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>

  <div footer class="sheet-footer-demo">
    <button type="button" class="demo-btn">Confirm</button>
    <button type="button" class="demo-btn demo-btn--primary">Reject</button>
  </div>
</kn-bottom-sheet>
      `,
    },
    {
      label: 'bottom-sheet.component.ts',
      language: 'typescript',
      code: `
@Component({
    selector: 'kn-bottom-sheet-via-service-component',
    imports: [KnBottomSheetComponent],
    templateUrl: './bottom-sheet.component.html',
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetViaServiceComponent {
}
      `,
    },
  ];
}
