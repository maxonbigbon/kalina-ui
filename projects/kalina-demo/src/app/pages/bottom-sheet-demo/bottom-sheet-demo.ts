import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { KnBottomSheetComponent } from 'kalina';

@Component({
  selector: 'kn-bottom-sheet-demo-page',
  imports: [KnBottomSheetComponent],
  templateUrl: './bottom-sheet-demo.html',
  styleUrl: './bottom-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetDemoPage {
  protected readonly open = signal(false);

  protected openSheet(): void {
    this.open.set(true);
  }
}

