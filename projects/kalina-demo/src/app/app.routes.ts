import { Routes } from '@angular/router';
import { TableDemoPage } from './pages/table-demo/table-demo';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'table', component: TableDemoPage },
];
