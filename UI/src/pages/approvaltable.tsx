"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { HT_Yard_Array } from "@/lib/ht-yard-array";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useGetApprovalGridQuery } from "@/services/query";
import { useTableFilterStore, useViewpageDetailedStore } from "@/store/store";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ViewGridPagination from "./view-grid-pagination";

// Define the type
export type ArrayType = {
  fieldId: number;
  name: string;
  value: number;
  type: string;
  transactiondataid?: string;
  transactionid?: string;
  child?: ArrayType[];
  SequenceId: number;
};

// Sample data with status included
const data = HT_Yard_Array.flatMap((field) => {
  if (field.child) {
    return field.child.map((child) => ({
      id: child.fieldId,
      name: child.name,
      value: child.value,
      type: child.type,
      sequence: child.SequenceId,
    }));
  } else {
    return [
      {
        id: field.fieldId,
        name: field.name,
        value: field.value,
        type: field.type,
        sequence: field.SequenceId,
      },
    ];
  }
});

// Dynamically create columns based on HT_Yard_Array
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: () => <div />,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="text-white border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...HT_Yard_Array.flatMap((field) => {
    if (field.child) {
      return field.child.map((child) => ({
        accessorKey: child.name.toLowerCase().replace(/ /g, "_"),
        header: child.name,
        cell: ({ row }) => (
          <div>
            {row.getValue(child?.name?.toLowerCase().replace(/ /g, "_"))}
          </div>
        ),
      }));
    } else {
      return [
        {
          accessorKey: field?.name.toLowerCase().replace(/ /g, "_"),
          header: field.name,
          cell: ({ row }) => (
            <div>
              {row.getValue(field?.name.toLowerCase().replace(/ /g, "_"))}
            </div>
          ),
        },
      ];
    }
  }),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy Field ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function ApprovalTable() {
  const navigate = useNavigate();
  const [dailyFieldsArray, setDailyFieldsArray] = React.useState([]);
  const [monthlyFieldsArray, setMonthlyFieldsArray] = React.useState([]);
  const TableFilter=useTableFilterStore((state)=>state)
  const {data:ApprovalGridData}=useGetApprovalGridQuery({
    locationId:TableFilter.locationId,
    PageSize:TableFilter.pageSize,
    PageNo:TableFilter.page
  })
console.log(ApprovalGridData,"ApprovalGridData")
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [actionType, setActionType] = React.useState<string | null>(null); // Track action type

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
////////////////////////////////////////////
  const viewpagedetailed=useViewpageDetailedStore((state)=>state)
 


  React.useEffect(() => {
    if (ApprovalGridData) {
      const totalPage = Math.ceil(ApprovalGridData.count / TableFilter.pageSize);
      TableFilter.setTotalPage(totalPage);
    }
  }, [ApprovalGridData]);

  const onrowclick=(rowdata:any)=>{
    alert(rowdata.transactionId)
    viewpagedetailed.setTransactionId(rowdata.transactionId)
    navigate("/approvaldetailed");
  }
////////////////////////////////
  const handleApprove = () => {
    setActionType("Approve");
    console.log("Approved rows:", rowSelection);
  };

  const handleReject = () => {
    setActionType("Reject");
    console.log("Rejected rows:", rowSelection);
  };

  return (
    <div className="w-full h-full flex flex-col  bg-yellow-100">
      <div className="w-full h-screen flex flex-col">
      <div className="w-full h-20 mt-3">
      <Button onClick={() => navigate("/approval")}>Back</Button>
        <label className="text-indigo-950 font-bold flex justify-center  ">
          WB MIXER RH2
        </label>
        <div className="gap-2">
        <div className="flex justify-start font-bold">Approval Pending :</div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid black' }} />
      </div>
      <br></br>
        
        <div className="flex-1 overflow-auto">
          <div className="min-w-full max-h-80 overflow-auto bg-indigo-950">
          <ScrollArea className="h-[100%] relative w-full rounded-sm border-none bg-indigo-950">
                    <Table>
                      <TableHeader className="bg-yellow-400 text-black ">
                       
                          <TableRow>
                          <TableHead></TableHead>
                          <TableHead className="w-[100px] ">transactionId</TableHead>
                          <TableHead>refId</TableHead>
                          <TableHead>createdDate</TableHead>
                          <TableHead>approvalStatus</TableHead>
                          <TableHead className="text-right">remarks</TableHead>
                        </TableRow>
                       
                      </TableHeader>
                      <TableBody className="pb-48">
                      {ApprovalGridData?.data?.map((rows:any,index:number) => (
          <TableRow onClick={()=>onrowclick(rows)} key={index}>
            <TableCell>
        <Checkbox
          checked={rowSelection[rows.transactionId] ?? false}
          onCheckedChange={(value) => {
            const updatedSelection = { ...rowSelection };
            if (value) {
              updatedSelection[rows.transactionId] = true;
            } else {
              delete updatedSelection[rows.transactionId];
            }
            setRowSelection(updatedSelection);
          }}
          aria-label="Select row"
          className="text-white border-white"
        />
      </TableCell>
          
            <TableCell className="font-medium text-white">{rows.transactionId}</TableCell>
            <TableCell className="text-white">{rows.refId}</TableCell>
            <TableCell className="text-white">{rows.createdDate}</TableCell>
            <TableCell className="text-white">{rows.approvalStatus}</TableCell>
            <TableCell className="text-right text-white">{rows.remarks}</TableCell>
          </TableRow>
        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t">
          <div className="flex justify-end w-full gap-1">
            <Dialog open={!!actionType} onOpenChange={setActionType}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApprove}
                // disabled={Object.keys(rowSelection).length === 0}
                className="bg-green-600 text-white border-green-400 hover:bg-green-400"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                // disabled={Object.keys(rowSelection).length === 0}
                className="bg-red-600 text-white border-red-400 hover:bg-red-400"
              >
                Reject
              </Button>

              <DialogContent className="bg-white text-black">
                <DialogHeader>
                  <DialogTitle>{actionType}Remarks</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <Textarea className="bg-white text-black placeholder:Enter your Remarks" />
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="bg-green-600 text-white hover:bg-green-300"
                    onClick={() => {
                      // Submit the remarks
                      console.log("Submitted Remarks");

                      // Deselect all rows
                      setRowSelection({});

                      // Close the dialog
                      setActionType(null);
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <ViewGridPagination count={ApprovalGridData?.count}/>
    </div>
  );
}
export default ApprovalTable;