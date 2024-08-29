import {
  Edit,
  Home,
  LayoutDashboard,
  List,
  LucideFileText,
  ScrollText,
  ShieldCheck
} from "lucide-react";
import { useLocation } from "react-router-dom";
import SideNavBarButton from "./SideNavBarButton";

type SideNavBarType = {
  MenuClose?: (data: boolean) => void;
};

export function SideNavBar({ MenuClose }: SideNavBarType) {
  const location = useLocation();
  const { hash, pathname, search } = location;
  const MenuList = [
    {
      Icon: Home,
      Name: "EHS",
      Link: "/",
    },
    
  ];
  return (
    <div className="w-full h-full overflow-y-auto bg-SideNavBarColor text-C_White rounded-lg p-2 scroll-smooth scroll-mx-0 scroll-p-0 border-0 md:border-2">
      <ul className="relative w-full h-full">
        {MenuList?.map((item, index) => (
          <li key={index} className="pt-2 group">
            <SideNavBarButton
              variant={"ghost"}
              className={
                "p-2 hover:bg-BackG hover:text-white " +
                (pathname === item.Link ? "bg-BackG text-white" : "")
              }
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
