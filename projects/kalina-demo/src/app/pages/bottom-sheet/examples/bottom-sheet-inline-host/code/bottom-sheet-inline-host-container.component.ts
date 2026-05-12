import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { KnBottomSheetComponent } from 'kalina';

@Component({
  selector: 'kn-bottom-sheet-inline-host-container',
  imports: [KnBottomSheetComponent],
  templateUrl: './bottom-sheet-inline-host-container.component.html',
  styleUrl: './bottom-sheet-inline-host-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetInlineHostContainerComponent {
  @ViewChild('sheet') private sheet?: KnBottomSheetComponent;

  protected readonly sheetData = new Date().toDateString();

  protected openSheet(): void {
    this.sheet?.open();
  }
}
