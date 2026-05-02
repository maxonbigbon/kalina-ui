import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'kn-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnTableComponent {
  readonly columns = input<string[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
}
