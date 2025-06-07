import {
  Home,
  AppWindow,
  CircleHelp,
  User,
  LogOut,
  ListTodo,
  FolderKanban,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import SideNavBarButton from "./SideNavBarButton";
import { PathList } from "@/router/router";
import { LayoutDashboard } from 'lucide-react';
type SideNavBarType = {
  MenuClose?: (data: boolean) => void;
};

export function SideNavBar({ MenuClose }: SideNavBarType) {
  const location = useLocation();
  const { pathname } = location;

  const MenuList = [
    {
      Icon: Home,
      Name: "EHS",
      Link: "/",
    },
    {
      Icon: AppWindow,
      Name: "Report",
      Link: PathList.DynamicGridTable,
    },
    {
      Icon: CircleHelp,
      Name: "FAQ",
      Link: "/N",
    },
    {
      Icon: User,
      Name: "Profile",
      Link: "/N",
    },
    {
      Icon: LogOut,
      Name: "Logout",
      Link: "/N",
    },
    {
      Icon: ListTodo,
      Name: "Approval",
      Link: PathList.Approval,
    },
    {
      Icon: FolderKanban,
      Name: "View",
      Link: PathList.View,
    },
    {
      Icon: LayoutDashboard,
      Name: "ViewDashboard",
      Link: PathList.ViewDashboard,
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-indigo-950 text-white rounded-lg p-2 scroll-smooth scroll-mx-0 scroll-p-0 border-0 md:border-2">
      <ul className="relative w-full h-full">
        {MenuList.map((item, index) => (
          <li key={index} className="pt-2 group">
            <SideNavBarButton
              variant={"ghost"}
              className={`p-2 hover:bg-BackG hover:text-white ${
                pathname === item.Link ? "bg-BackG text-white" : ""
              }`}
              icon={item.Icon}
              Link={item.Link}
              MenuClose={MenuClose}
            >
              {item.Name}
            </SideNavBarButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
