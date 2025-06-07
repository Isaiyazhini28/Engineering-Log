import Authenticated from "@/Authenticated/authenticated";
import Layout from "@/Layout/Layout";
import { DynamicFormComp } from "@/pages/DynamicFormComp";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Approval from "@/pages/approval";
import Approvaltable from "@/pages/approvaltable";
import { ReadingView } from "@/pages/reading";
import LoginPage from "@/pages/Login";
import View from "@/pages/view";
import { DynamicGridTable } from "@/pages/dynamicgrid";
import ViewDashboard from "@/pages/viewdashboard";
import ViewGrid from "@/pages/viewgrid";






export const PathList = {
  Home: "/",
  Login: "/login",
  Dashboard: "/",
  DynamicFormComp: "/dynamicformcomp",
  DynamicGridTable: "/dynamicgridtable",
  Approval: "/approval",
  Approvaltable: "/approvaltable",
  View:"/view",
  ViewDashboard:"/viewdashboard",
  ViewGrid:"/viewgrid",
  
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
      { path: PathList.ViewGrid, element: <ViewGrid/> },
      { path: PathList.ViewDashboard, element:<ViewDashboard/> },
      { path: PathList.View, element: <ReadingView/> },
      { path: PathList.Approval, element: <Approval /> },
      { path: PathList.Approvaltable, element: <Approvaltable /> },
      { path: PathList.Dashboard, element: <Dashboard /> },
      { path: PathList.DynamicFormComp, element: <DynamicFormComp /> },
      { path: PathList.DynamicGridTable, element: <DynamicGridTable  /> },
    ],
  },
  { path: PathList.Login, element: <LoginPage /> },
];

const routes = createBrowserRouter([...MainPage]);

export default routes;