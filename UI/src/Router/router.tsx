import Authenticated from "@/Authenticated/authenticated";
import Layout from "@/Layout/Layout";
import { DynamicFormComp } from "@/Pages/DynamicFormComp";
import { columns, data, DynamicGridTable } from "@/Pages/dynamicgrid";


import Login from "@/Pages/Login";
import { ColumnDef } from "@tanstack/react-table";




import { RouteObject, createBrowserRouter } from "react-router-dom";
import Dashboard from "@/Pages/dashboard";
import Approval from "@/Pages/approval";
import Approvaltable from "@/Pages/approvaltable";
import { View } from "@/Pages/view";
import { ReadingView } from "@/Pages/reading";






export const PathList = {
  Home: "/",
  Login: "/",
  Dashboard: "/",
  DynamicFormComp: "/dynamicformcomp",
  DynamicGridTable: "/dynamicgridtable",
  Approval: "/approval",
  Approvaltable: "/approvaltable",
  View:"/view"
  
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
      { path: PathList.View, element: <ReadingView /> },
      { path: PathList.Approval, element: <Approval /> },
      { path: PathList.Approvaltable, element: <Approvaltable /> },
      { path: PathList.Dashboard, element: <Dashboard /> },
      { path: PathList.DynamicFormComp, element: <DynamicFormComp /> },
      { path: PathList.DynamicGridTable, element: <DynamicGridTable  /> },
    ],
  },
  { path: PathList.Login, element: <Login /> },
];

const routes = createBrowserRouter([...MainPage]);

export default routes;