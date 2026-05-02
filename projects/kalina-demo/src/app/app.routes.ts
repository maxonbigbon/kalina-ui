import { Routes } from '@angular/router';
import { TableDemoPage } from './pages/table-demo/table-demo';
import { BottomSheetDemoPage } from './pages/bottom-sheet-demo/bottom-sheet-demo';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'table', component: TableDemoPage },
  { path: 'bottom-sheet', component: BottomSheetDemoPage },
];
