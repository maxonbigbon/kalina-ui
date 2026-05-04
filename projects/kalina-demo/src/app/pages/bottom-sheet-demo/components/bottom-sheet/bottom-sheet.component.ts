import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KnBottomSheetComponent } from 'kalina';

@Component({
  selector: 'kn-bottom-sheet-demo',
  imports: [KnBottomSheetComponent],
  templateUrl: './bottom-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetDemoComponet {

}

