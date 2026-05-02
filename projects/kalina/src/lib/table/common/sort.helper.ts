import { KnColDef, KnRow, KnSortDirection } from "../table.types";

export function sortData(
  data: KnRow[], 
  colDef: KnColDef, 
  direction: KnSortDirection
): KnRow[] {
  if (!direction) {
    return data;
  }

  const sortedRows = [...data].sort((rowA, rowB) => {
    const valA = rowA[colDef.field];
    const valB = rowB[colDef.field];

    let comparison = 0;

    if (colDef.sortFn) {
      comparison = colDef.sortFn(valA, valB);
    } else {
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB)); 
      }
    }

    return direction === 'ascend' ? comparison : -comparison;
  });

  return sortedRows.map(row => {
    if (row['children'] && Array.isArray(row['children']) && row['children'].length > 0) {
      return {
        ...row,
        children: sortData(row['children'], colDef, direction)
      };
    }
    return row;
  });
}