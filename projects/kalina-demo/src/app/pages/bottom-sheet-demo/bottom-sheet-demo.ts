import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { KnBottomSheetComponent, KnBottomSheetService } from 'kalina';
import { KnBottomSheetDemoComponet } from './components/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'kn-bottom-sheet-demo-page',
  imports: [KnBottomSheetComponent],
  templateUrl: './bottom-sheet-demo.html',
  styleUrl: './bottom-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetDemoPage {
  private bottomSheetService = inject(KnBottomSheetService);
  protected readonly open = signal(false);

  protected openSheet(): void {
    this.open.set(true);
    this.bottomSheetService.open(KnBottomSheetDemoComponet);
  }
}

