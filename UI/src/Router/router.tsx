import Authenticated from "@/Authenticated/authenticated";
import Layout from "@/Layout/Layout";
import HomePage from "@/Pages/Home";
import Login from "@/Pages/Login";
import { DynamicFormComp } from "@/Pages/testform";
import { RouteObject, createBrowserRouter } from "react-router-dom";

const PathList = {
  Home: "",
  Login: "/Login",
  Dashboard: "/",
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
      {
        path: PathList.Dashboard,
        element: <DynamicFormComp />,
      },
    ]
  },
  {
    path: PathList.Login,
    element: <Login />
  }
 
];



const routes = createBrowserRouter([...MainPage]);

export default routes;
