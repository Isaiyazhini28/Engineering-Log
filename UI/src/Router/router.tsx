import Authenticated from "@/Authenticated/authenticated";
import Layout from "@/Layout/Layout";
import { DynamicFormComp } from "@/pages/DynamicFormComp";
import { columns, data, DynamicGridTable } from "@/pages/dynamicgrid";


import Login from "@/pages/Login";
import { ColumnDef } from "@tanstack/react-table";




import { RouteObject, createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Approval from "@/pages/approval";
import Approvaltable from "@/pages/approvaltable";
import { View } from "@/pages/view";
import { ReadingView } from "@/pages/reading";






export const PathList = {
  Home: "",
  Login: "/login",
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