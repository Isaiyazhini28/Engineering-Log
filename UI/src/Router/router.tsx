import Authenticated from "@/Authenticated/authenticated";
import Layout from "@/Layout/Layout";
import { DynamicFormComp } from "@/pages/DynamicFormComp";
import { DynamicGridTable } from "@/pages/dynamicgrid";


import Login from "@/pages/Login";
import { ColumnDef } from "@tanstack/react-table";




import { RouteObject, createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/dashboard";

export const data = [
  {
    day1: "11.2",
    day2: "23",
    day3: "99.9",
    day4: "45.67",
    day5: "98.9",
    day6: "0.22",
  },
  {
    day1: "0.98",
    day2: "-0.876",
    day3: "0.12",
    day4: "96.4",
    day5: "0.9",
    day6:"79.0",
  },
  
  
  // Add more rows as needed
];


export const columns: ColumnDef<any>[] = [
  {
    header: "M3-1",
    accessorKey: "day1",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
  {
    header: "M3-2",
    accessorKey: "day2",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
  {
    header: "M3-3",
    accessorKey: "day3",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
  {
    header: "M3-4",
    accessorKey: "day4",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
  {
    header: "M3-5",
    accessorKey: "day5",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
  {
    header: "M3-6",
    accessorKey: "day6",
    cell: (info: { getValue: () => any; }) => info.getValue(),
  },
];
export const PathList = {
  Home: "",
  Login: "/login",
  Dashboard: "/",
  DynamicFormComp: "/dynamicformcomp",
  DynamicGridTable: "/dynamicgridtable",
};

const MainPage: RouteObject[] = [
  {
    path: PathList.Home,
    element: (
      <Authenticated>
        <Layout />
      </Authenticated>
    ),
    children: [
      { path: PathList.Dashboard, element: <Dashboard /> },
      { path: PathList.DynamicFormComp, element: <DynamicFormComp /> },
      { path: PathList.DynamicGridTable, element: <DynamicGridTable data={data} columns={columns} /> },
    ],
  },
  { path: PathList.Login, element: <Login /> },
];

const routes = createBrowserRouter([...MainPage]);

export default routes;