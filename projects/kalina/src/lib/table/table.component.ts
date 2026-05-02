import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, OnChanges, OnInit, output, SimpleChanges, viewChild } from "@angular/core";
import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { KnCellStyle, KnColDef, KnDefaultColDef, KnRow, KnSortDirection, KnTableCellEvent } from "./table.types";
import { sortData } from "./common/sort.helper";
import { KnSortIconComponent } from "./common/sort-icon.component";

@Component({
    selector: 'kn-table',
    imports: [NgClass, NgStyle, NgTemplateOutlet, KnSortIconComponent],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnTableComponent implements OnInit, OnChanges {
    tbody = viewChild.required('tbody', {read: ElementRef});
    destroyRef = inject(DestroyRef);
    defaultColDef = input<KnDefaultColDef>();
    colDefs = input<KnColDef[]>([]);
    data = input<KnRow[]>([]);
    layout = input<'fill' | 'content'>('fill');
    tableClass = input('');
    optionKeyField = input<string>('id'); // Поле уникального идентификатора при использовании древовидной структуры
    cellClick = output<{cellIndex: number; rowIndex: number, colDef: KnColDef; item: KnRow | null}>();
    rowStateCollection = new Map();
    gridTemplateColumnsStyle = 'repeat(auto-fill, 100px)';
    sortState: { field: string | null; direction: KnSortDirection } = {
        field: null,
        direction: null
    };
    currentData: KnRow[] = [];
    extendedColDefs: KnColDef[] = [];

    ngOnInit(): void {
        fromEvent<PointerEvent>(this.tbody().nativeElement, 'click').pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((event) => {
            if (!event.target) return;
            const td = (event.target as HTMLElement).closest('td') as HTMLTableCellElement;
            if (!td) return;
            
            const rowIndex = (td.parentElement as HTMLTableRowElement)?.rowIndex - 1;// th не считаем
            const cellIndex = td.cellIndex;
            const field = td.getAttribute('data-field');
            const path = (td.getAttribute('data-path') || '').split('/');

            this.cellClick.emit({
                cellIndex,
                rowIndex,
                colDef: this.extendedColDefs.find((colDef) => colDef.field === field) as KnColDef,
                item: this.getItemByPath(path, this.currentData),
            });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']?.currentValue) {
            this.rowStateCollection.clear();
            this.setRowStates(changes['data']?.currentValue);
            this.currentData = changes['data']?.currentValue as KnRow[];
        }
        if (changes['colDefs']?.currentValue) {
            this.calculateColumnsWidth(changes['colDefs']?.currentValue);
            this.extendColDefs(changes['colDefs']?.currentValue);
        }
    }

    public toggleRow(row: KnRow): void {
        this.rowStateCollection.set(row[this.optionKeyField()], !this.rowStateCollection.get(row[this.optionKeyField()]));
    }

    public hasChildren(row: KnRow): boolean {
        return Array.isArray(row['children']) ? !!row['children']?.length : false;
    }

    public isVisibleRow(row: KnRow): boolean {
        return this.rowStateCollection.get(row[this.optionKeyField()]);
    }

    public onSort(colDef: KnColDef) {
        if (colDef.sortable) {
            if (this.sortState.field !== colDef.field) {
                this.sortState.field = colDef.field;
                this.sortState.direction = 'ascend';
            } else {
                if (this.sortState.direction === 'ascend') {
                    this.sortState.direction = 'descend';
                } else if (this.sortState.direction === 'descend') {
                    this.sortState.direction = null;
                    this.sortState.field = null;
                } else {
                    this.sortState.direction = 'ascend';
                }
            }
            this.applySorting();
        }
    }
    
    public getSortDirectionByColDef(colDef: KnColDef): KnSortDirection {
        if (this.sortState.field !== colDef.field) {
            return null;
        };
        
        return this.sortState.direction === 'ascend' ? 'ascend' : 'descend';
    }

    public getCellEvent(item: any, colDef: KnColDef): KnTableCellEvent {
        return {
            value: item[colDef.field],
            item,
            colDef,
        };
    }

    public getCellStyle(item: any, colDef: KnColDef): KnCellStyle {
        if (colDef.getCellStyle) {
            return colDef.getCellStyle(this.getCellEvent(item, colDef));
        }

        return null;
    }

    public getCellClass(item: any, colDef: KnColDef): string[] {
        const classes = (Array.isArray(colDef.cellClass) ? colDef.cellClass : [colDef.cellClass]).flatMap((item) => (item || '').split(/\s+/));
  
        if (colDef.getCellClass) {
            return [...classes, ...(colDef.getCellClass(this.getCellEvent(item, colDef)) || [])];
        }

        return classes;
    }

    private setRowStates(items: KnRow[]): void {
        (items || []).forEach((item) => {
            this.rowStateCollection.set(item[this.optionKeyField()] as string, true);

            if (item['children']) {
                this.setRowStates(item['children'] as KnRow[]);
            }
        });
    }

    private calculateColumnsWidth(colDefs: KnColDef[]): void {
        this.gridTemplateColumnsStyle = colDefs.map((colDef) => {
            if (colDef.width) {
                return colDef.width + 'px';
            } else if (colDef.minWidth && colDef.maxWidth) {
                return `minmax(${colDef.minWidth}px, ${colDef.maxWidth}px)`
            } else if (colDef.minWidth && !colDef.maxWidth) {
                return `minmax(${colDef.minWidth}px, 1fr)`;
            } else if (!colDef.minWidth && colDef.maxWidth) {
                return `minmax(1fr, ${colDef.maxWidth}px)`;
            } else {
                return '1fr';
            }
        }).join(' ');
    }

    private applySorting() {
        if (!this.sortState.field || !this.sortState.direction) {
            this.currentData = this.data() || [];
            return;
        }

        const activeCol = this.extendedColDefs.find(c => c.field === this.sortState.field);
        if (activeCol) {
            this.currentData = sortData(this.data() || [], activeCol, this.sortState.direction);
        } else {
            this.currentData = this.data() || [];
        }
    }

    private extendColDefs(colDefs: KnColDef[]) {
        this.extendedColDefs = colDefs.map((colDef) => ({
            ...(this.defaultColDef() || {}),
            ...colDef,
        }));
    };

    private getItemByPath(path: string[], data: KnRow[]): KnRow | null {
        let currentItems = data;
        let result: KnRow | null = null;

        for (let i = 0; i < path.length; i++) {
            const index = parseInt(path[i], 10);

            if (isNaN(index) || index < 0 || index >= currentItems.length) {
                return null;
            }

            result = currentItems[index];

            if (i < path.length - 1) {
                if (!result['children'] || !Array.isArray(result['children'])) {
                    return null;
                }
                currentItems = result['children'];
            }
        }

        return result;
    }
}