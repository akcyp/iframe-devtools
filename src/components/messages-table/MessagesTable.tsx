import { useState, useMemo, useEffect, useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { IframeMessage } from '@src/types/message';
import { filter } from '@src/utils/filter';
import { formatTime } from '@src/utils/formatTime';
import { formatUrl } from '@src/utils/formatUrl';
import { stringify } from '@src/utils/stringify';
import { truncate } from '@src/utils/truncate';

import classes from './MessagesTable.module.css';

interface MessagesTableProps {
  messages: IframeMessage[];
  filterText?: string;
  onMessageSelect?: (message: IframeMessage | null) => void;
  onMessageOpen?: (message: IframeMessage | null) => void;
}

export function MessagesTable({ messages, filterText = '', onMessageSelect, onMessageOpen }: MessagesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const selectedRowIndexRef = useRef<number>(-1);

  // Filter messages based on filter text
  const filteredMessages = useMemo(() => {
    if (!filterText) return messages;
    return filter(messages, filterText);
  }, [messages, filterText]);

  const columns: ColumnDef<IframeMessage>[] = useMemo(() => [
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }) => (
        <span className={classes.monospace}>
          {formatTime(row.original.timestamp)}
        </span>
      ),
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        const msg = row.original;
        const displayUrl = formatUrl(msg.source);
        const fullInfo = msg.sourceOrigin && msg.sourceOrigin !== msg.source
          ? `${msg.source}\nOrigin: ${msg.sourceOrigin}`
          : msg.source;

        return (
          <span className={classes.code} title={fullInfo}>
            {msg.isSourceTop && <span className={classes.badge}>Top</span>}
            {displayUrl}
          </span>
        );
      },
      size: 200,
      minSize: 200,
      maxSize: 300,
    },
    {
      accessorKey: 'target',
      header: 'Target',
      cell: ({ row }) => {
        const msg = row.original;
        const displayUrl = formatUrl(msg.target);
        const fullInfo = msg.targetOrigin && msg.targetOrigin !== msg.target
          ? `${msg.target}\nOrigin: ${msg.targetOrigin}`
          : msg.target;

        return (
          <span className={classes.code} title={fullInfo}>
            {msg.isTargetTop && <span className={classes.badge}>Top</span>}
            {displayUrl}
          </span>
        );
      },
      size: 200,
      minSize: 200,
      maxSize: 300,
    },
    {
      accessorKey: 'direction',
      header: 'Direction',
      cell: ({ row }) => {
        const direction = row.original.direction;
        return (
          <span className={direction === 'sent' ? classes.blue : classes.green}>
            {direction === 'sent' ? '↑ Sent' : '↓ Received'}
          </span>
        );
      },
      size: 60,
      minSize: 60,
      maxSize: 60,
    },
    {
      accessorKey: 'data',
      header: 'Message',
      cell: ({ row }) => (
        <span className={classes.monospace} title={stringify(row.original.data)}>
          {truncate(row.original.data)}
        </span>
      ),
      size: 200,
      minSize: 150,
      maxSize: 400,
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <span className={classes.monospace}>
          {row.original.size} B
        </span>
      ),
      size: 40,
      minSize: 40,
      maxSize: 70,
    },
  ], []);

  const table = useReactTable({
    data: filteredMessages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    getRowId: (row) => row.id,
  });

  // Update selected row index when selection changes
  useEffect(() => {
    if (selectedRow !== null) {
      const rows = table.getRowModel().rows;
      const index = rows.findIndex(row => row.id === selectedRow);
      selectedRowIndexRef.current = index;
    } else {
      selectedRowIndexRef.current = -1;
    }
  }, [selectedRow, table]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const rows = table.getRowModel().rows;
      if (rows.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = selectedRowIndexRef.current;
        const newIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : currentIndex;
        if (newIndex !== currentIndex) {
          const newRow = rows[newIndex];
          selectedRowIndexRef.current = newIndex;
          setSelectedRow(newRow.id);
          onMessageSelect?.(newRow.original);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = selectedRowIndexRef.current;
        const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        if (newIndex !== currentIndex || currentIndex === -1) {
          const newRow = rows[newIndex];
          selectedRowIndexRef.current = newIndex;
          setSelectedRow(newRow.id);
          onMessageSelect?.(newRow.original);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentIndex = selectedRowIndexRef.current;
        if (currentIndex >= 0 && currentIndex < rows.length) {
          const currentRow = rows[currentIndex];
          onMessageOpen?.(currentRow.original);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onMessageSelect, onMessageOpen, table]);

  return (
    <div className={classes.tableContainer} tabIndex={0}>
      <div className={classes.scrollContainer}>
        <table className={classes.table}>
          <thead>
            <tr>
              {table.getHeaderGroups()[0]?.headers.map((header) => {
                const sortState = header.column.getIsSorted();
                const sortClass = sortState
                  ? sortState === 'asc' ? classes.sortAscending : classes.sortDescending
                  : '';
                const canSort = header.column.getCanSort();

                return (
                  <th
                    key={header.id}
                    className={`${canSort ? classes.sortable : ''} ${sortClass}`.trim()}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                    tabIndex={canSort ? 0 : undefined}
                    role="columnheader"
                    aria-label={canSort ? 'Sortable column. Press enter to apply sorting filter' : undefined}
                    aria-sort={sortState ? (sortState === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <div>
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                    {canSort && (
                      <div className={classes.sortIconContainer}>
                        <span className={classes.sortIcon}></span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const isSelected = row.id === selectedRow;
                return (
                  <tr
                    key={row.id}
                    className={isSelected ? classes.selected : ''}
                    onClick={() => {
                      setSelectedRow(row.id);
                      onMessageSelect?.(row.original);
                    }}
                    onDoubleClick={() => {
                      onMessageOpen?.(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        <div>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className={classes.emptyState}>
                    No messages captured yet
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
