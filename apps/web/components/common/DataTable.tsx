'use client';

import { useMemo, useState } from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Inbox,
} from 'lucide-react';

import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  getSearchableText?: (item: TData) => string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function DataTable<TData>({
  columns,
  data,
  getSearchableText,
  searchPlaceholder = 'Pesquisar...',
  emptyTitle = 'Não existem registos',
  emptyDescription = 'Os registos serão apresentados nesta tabela.',
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm);

    if (!normalizedSearchTerm || !getSearchableText) {
      return data;
    }

    return data.filter((item) => {
      const searchableText = normalizeText(getSearchableText(item));

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [data, getSearchableText, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRecords = data.length;
  const filteredRecords = filteredData.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = Math.max(table.getPageCount(), 1);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    table.setPageIndex(0);
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
        />

        <p className="shrink-0 text-sm text-muted-foreground">
          A mostrar{' '}
          <span className="font-medium text-foreground">
            {filteredRecords}
          </span>{' '}
          de{' '}
          <span className="font-medium text-foreground">
            {totalRecords}
          </span>{' '}
          {totalRecords === 1 ? 'registo' : 'registos'}
        </p>
      </div>

      {filteredRecords === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="size-6 text-muted-foreground" />
          </div>

          <h2 className="text-base font-semibold">
            {searchTerm ? 'Nenhum resultado encontrado' : emptyTitle}
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {searchTerm
              ? 'Experimenta alterar ou limpar os termos utilizados na pesquisa.'
              : emptyDescription}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortingDirection =
                        header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          className={cn(
                            'h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                            header.column.id === 'actions' &&
                              'text-right',
                          )}
                        >
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                              {sortingDirection === 'asc' && (
                                <ChevronUp className="size-4" />
                              )}

                              {sortingDirection === 'desc' && (
                                <ChevronDown className="size-4" />
                              )}

                              {!sortingDirection && (
                                <ArrowUpDown className="size-3.5 opacity-50" />
                              )}
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-4 py-4 align-middle',
                          cell.column.id === 'actions' &&
                            'text-right',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.getPageCount() > 1 && (
            <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Página{' '}
                <span className="font-medium text-foreground">
                  {currentPage}
                </span>{' '}
                de{' '}
                <span className="font-medium text-foreground">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ArrowLeft className="size-4" />
                  Anterior
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Seguinte
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}