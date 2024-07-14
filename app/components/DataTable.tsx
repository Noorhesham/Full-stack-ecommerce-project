"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./AdvancedPagination";
import React, { useEffect } from "react";
import ServerFilter from "./ServerFilter";
import ServerSearch from "./ServerSearch";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PopUp from "./PopUp";
interface TableData {
  _id: string;
  name: string;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  totalPages: number;
  handleDeleteAll: (ids: string[]) => void;
}

export function DataTable<TData extends TableData, TValue>({
  columns,
  data,
  page,
  totalPages,
  handleDeleteAll,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  console.log(totalPages);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  //@ts-ignore
  const chosen = table?.getSelectedRowModel().flatRows.map((row) => row.original?._id);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1); // Remove the '#' from the hash
      // Scroll to the element with the ID
      const element = document.getElementById(id);
      console.log(id, element);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // Select the row in the table
        const rowIndex = table.getRowModel().rows.findIndex((row) => row.original?._id === id);
        if (rowIndex !== -1) {
          table.getRowModel().rows[rowIndex].toggleSelected(true);
        }
      }
    }
  }, [data, table]);
  return (
    <div className="">
      {chosen.length > 0 && <PopUp count={chosen.length} handleDelete={() => handleDeleteAll(chosen)} />}
      <div className="flex justify-between items-center py-4">
        <div className="flex gap-2 items-center">
          {table.getColumn("name") && (
            <Input
              placeholder="Filter names..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-2">
          <ServerSearch />
          <ServerFilter />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow id={row.original?._id} key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell id={cell.id} className=" text-center" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination server={false} totalPages={totalPages} i={page} table={table} />
    </div>
  );
}
