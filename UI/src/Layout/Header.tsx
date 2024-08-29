
import { Menu } from "lucide-react";
import { useState } from "react";
import Logo from "../assets/3.png";
import { SideNavBar } from "./SideNavBar";
import { Button } from "../components/ui/button";
import ProfilePopover from "./profile-popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";


interface Header {
  SreachBox?: (data: boolean) => void;
}

export function Header({ SreachBox }: Header) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const SearchBoxOpen = (data: boolean) => {
    if (SreachBox !== undefined) {
      SreachBox(data)
    }
  }
  return (
    <header className="bg-HeaderBackground text-white h-10 items-center pl-2 pr-2 flex justify-between shadow-sm shadow-gray-500">
      <Button
        onClick={() => setSideMenuOpen(true)}
        className="md:hidden p-0"
        variant="ghost"
      >
        <Menu />
      </Button>
      <Sheet open={sideMenuOpen} onOpenChange={setSideMenuOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent side={"left"} className="pt-10">
          <DialogTitle>Menu</DialogTitle>
          <SideNavBar MenuClose={setSideMenuOpen} />
        </SheetContent>
      </Sheet>
      <div>
        <img src={Logo} className="w-8 repeat-0 drop-shadow-lg" />
      </div>
      <div className="flex gap-3 items-center">
        {/* <div className="flex items-center space-x-2">
          <Label htmlFor="airplane-mode">Me</Label>
          <Switch
            checked={itsme}
            onCheckedChange={() => setItsMe(!itsme)}
            id="airplane-mode"
            color="gray"
            className="bg-red-500"
          />
        </div> */}
        <ProfilePopover />
      </div>
    </header >
  );
}
