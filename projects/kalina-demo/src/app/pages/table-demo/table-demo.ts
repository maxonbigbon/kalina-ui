import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KnTableComponent } from 'kalina';

@Component({
  selector: 'kn-table-demo-page',
  imports: [KnTableComponent],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDemoPage {
  readonly columns = ['Name', 'Role', 'Status'];
  readonly rows = [
    { Name: 'Kalina', Role: 'UI Kit', Status: 'WIP' },
    { Name: 'Angular', Role: 'Framework', Status: 'Stable' },
  ];
}

