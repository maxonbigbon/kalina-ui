import { Routes } from '@angular/router';
import { TableDemoPage } from './pages/table-demo/table-demo';
import { BottomSheetContainer } from './pages/bottom-sheet/bottom-sheet-container.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'table', component: TableDemoPage },
  { path: 'bottom-sheet', component: BottomSheetContainer },
];
