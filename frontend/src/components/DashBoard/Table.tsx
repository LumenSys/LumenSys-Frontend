import React from 'react';

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}


interface TableAction {
  label: string;
  onClick: () => void;
  className?: string;
}

interface GenericTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction[];
  onRowClick?: (row: T) => void;
}

export default function GenericTable<T>({
  title,
  columns,
  data,
  actions = [],
  onRowClick,
}: GenericTableProps<T>) {
  const renderCell = (column: TableColumn<T>, row: T) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    return (
      <span className={`${column.className || ''}`}>
        {typeof value === 'number' && String(column.key).toLowerCase().includes('valor')
          ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : String(value ?? '')} {/* ← converte para string de forma segura */}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-textPrimary">{title}</h2>

        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`px-4 py-2 bg-primary text-background rounded hover:bg-secondary transition ${action.className || ''}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral/30">
        <table className="min-w-full divide-y divide-neutral text-sm text-textPrimary">
          <thead className="bg-primary text-background">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left font-bold whitespace-nowrap ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-textSecondary"
                >
                  Nenhum dado disponível.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-surfaceUser transition ${onRowClick ? 'cursor-pointer' : ''
                    }`}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  tabIndex={onRowClick ? 0 : -1}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-3 whitespace-nowrap ${column.className || ''}`}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
