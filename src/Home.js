import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
  { field: 'col1', headerName: 'File', flex: 1 },
  { field: 'col2', headerName: 'Status', flex: 1 },
];

export default function Home() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
