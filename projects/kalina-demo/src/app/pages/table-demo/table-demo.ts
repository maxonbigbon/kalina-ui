import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KnColDef, type KnDefaultColDef, KnTableComponent, type KnRow } from 'kalina';

@Component({
  selector: 'kn-table-demo-page',
  imports: [KnTableComponent],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDemoPage {
  readonly defaultColDef: KnDefaultColDef = {
    sortable: true,
    headerCellClass: 'kn-table-demo__th',
    cellClass: 'kn-table-demo__td',
    minWidth: 140,
  };

  readonly colDefs: KnColDef[] = [
    {
      field: 'name',
      name: 'Сотрудник',
      minWidth: 240,
      cellRenderer: (e) => {
        const level = Number((e.item as any)?.level ?? 0);
        const title = String((e.item as any)?.title ?? '');
        return `<div class="kn-emp">
          <div class="kn-emp__name">${String(e.value ?? '')}</div>
          <div class="kn-emp__meta">Уровень: ${level} · ${title}</div>
        </div>`;
      },
    },
    { field: 'department', name: 'Подразделение', minWidth: 180 },
    { field: 'team', name: 'Команда', minWidth: 180 },
    { field: 'location', name: 'Локация', minWidth: 140 },
    {
      field: 'status',
      name: 'Статус',
      minWidth: 130,
      getCellClass: (e) => {
        const s = String((e.item as any)?.status ?? '').toLowerCase();
        return ['kn-badge', `kn-badge--${s || 'unknown'}`];
      },
    },
  ];

  // 3 уровня вложенности children:
  // CEO -> (VPs) -> (Managers) -> (ICs)
  readonly data: KnRow[] = [
    {
      id: 'e-001',
      level: 0,
      name: 'Калина Максимова',
      title: 'CEO',
      department: 'Management',
      team: 'Executive',
      location: 'Москва',
      status: 'active',
      children: [
        {
          id: 'e-010',
          level: 1,
          name: 'Иван Орлов',
          title: 'VP Engineering',
          department: 'Engineering',
          team: 'Platform',
          location: 'СПб',
          status: 'active',
          children: [
            {
              id: 'e-011',
              level: 2,
              name: 'Анна Белова',
              title: 'Engineering Manager',
              department: 'Engineering',
              team: 'UI Platform',
              location: 'СПб',
              status: 'active',
              children: [
                {
                  id: 'e-012',
                  level: 3,
                  name: 'Дмитрий Кузнецов',
                  title: 'Senior Frontend Engineer',
                  department: 'Engineering',
                  team: 'UI Platform',
                  location: 'Удаленно',
                  status: 'active',
                },
                {
                  id: 'e-013',
                  level: 3,
                  name: 'Мария Петрова',
                  title: 'Frontend Engineer',
                  department: 'Engineering',
                  team: 'UI Platform',
                  location: 'Москва',
                  status: 'on_leave',
                },
              ],
            },
            {
              id: 'e-020',
              level: 2,
              name: 'Сергей Волков',
              title: 'Engineering Manager',
              department: 'Engineering',
              team: 'Core Services',
              location: 'Москва',
              status: 'active',
              children: [
                {
                  id: 'e-021',
                  level: 3,
                  name: 'Олег Смирнов',
                  title: 'Backend Engineer',
                  department: 'Engineering',
                  team: 'Core Services',
                  location: 'Москва',
                  status: 'active',
                },
              ],
            },
          ],
        },
        {
          id: 'e-030',
          level: 1,
          name: 'Елена Соколова',
          title: 'VP Product',
          department: 'Product',
          team: 'Discovery',
          location: 'Москва',
          status: 'active',
          children: [
            {
              id: 'e-031',
              level: 2,
              name: 'Никита Громов',
              title: 'Product Manager',
              department: 'Product',
              team: 'UI Kit',
              location: 'Удаленно',
              status: 'active',
              children: [
                {
                  id: 'e-032',
                  level: 3,
                  name: 'Алиса Фомина',
                  title: 'Product Analyst',
                  department: 'Product',
                  team: 'UI Kit',
                  location: 'Москва',
                  status: 'active',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

