import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BottomSheetViaServiceComponent } from './examples/bottom-sheet-via-service/bottom-sheet-via-service.component';

@Component({
  selector: 'kn-bottom-sheet-container',
  imports: [BottomSheetViaServiceComponent],
  templateUrl: './bottom-sheet-container.component.html',
  styleUrl: './bottom-sheet-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetContainer {}
