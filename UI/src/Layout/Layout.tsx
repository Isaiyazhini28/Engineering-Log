import { Header } from "@/Layout/Header";
import { SideNavBar } from "@/Layout/SideNavBar";
import { CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader } from "@/components/loader";
import { useGetDashboardMonthlyQuery, useGetDashboardQuery } from "@/services/query";
import { useHtYardStore } from "@/store/store";

export const KEY_USER_SESSIONS = import.meta.env.VITE_SSO_KEY_NAME;
export const KEY_USER_DOMAIN = import.meta.env.VITE_SSO_DOMAIN;

export default function Layout() {
  const Navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: DashboardData } = useGetDashboardQuery();
  const { data: DashboardMonthlyData } = useGetDashboardMonthlyQuery();


  const onSearchBoxOpen = (data: boolean) => {
    setIsOpen(data);
  };
  const setDashboardData = useHtYardStore((state) => state.setHtYard);
  useEffect(() => {
    if (DashboardData?.length > 0) {
      setDashboardData(DashboardData);
    }
  }, [DashboardData]);
  
 

  const setDashboardMonthlyData = useHtYardStore((state) => state.setHtYardMonthly);
  useEffect(() => {
    if (DashboardMonthlyData?.length > 0) {
      setDashboardMonthlyData(DashboardMonthlyData);
    }
  }, [DashboardMonthlyData]);
  


 

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header SreachBox={onSearchBoxOpen} />
      <div className="flex flex-1 h-full w-full overflow-hidden">
        <aside className="NavBarClass bg-transparent max-h-full h-full overflow-auto w-[3.7rem] min-md:w-64 hover:w-64 p-0 lg:block tarnsition-all duration-700 hidden">
          <SideNavBar />
        </aside>
        <div className="flex-1 h-full w-full md:pt-1 md:pr-1 flex flex-col">
          <div className="flex-1  h-full w-full flex flex-col items-center p-0">
            <CardContent className="flex-1 w-full h-full p-0">
           
              <Outlet />
              {false && <Loader />}
            </CardContent>
          </div>
        </div>
      </div>
      <footer className="bg-blue-200 text-white p-2 hidden">
        <div className="container mx-auto">Footer</div>
      </footer>
    </div>
  );
}
