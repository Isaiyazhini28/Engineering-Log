import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getShortName } from "@/lib/utils copy";
// import { userGetUserDetail } from "@/services/queries";
import { LogOut, X } from "lucide-react";
import { useState } from "react";

const ProfilePopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user={
    name:"madhu",
    email:"madhu@getMaxListeners.com"
  }

  const logout=()=>{

  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar className="mr-2 cursor-pointer shadow w-8 h-8">
          <AvatarImage src={""} />
          <AvatarFallback className="font-bold bg-BackG  text-[10px]">
            {getShortName(user?.name)}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="-mt-[54px] w-screen rounded-none p-0 shadow-lg md:mr-2 md:mt-3 md:w-96 md:rounded-2xl">
        <div className="relative flex h-screen w-full flex-col items-center bg-primary/10 p-2 md:h-auto md:rounded-2xl">
          <X
            onClick={() => setIsOpen(false)}
            className=" absolute right-2 h-6 w-6 cursor-pointer rounded-full p-1 text-slate-800 hover:bg-primary/20"
          />
          <div className="relative mt-2 h-24 w-24">
            <Avatar className="h-full w-full cursor-pointer border-2 border-slate-800">
              <AvatarImage src={user?.name} />
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {getShortName(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 h-6 w-6 cursor-pointer rounded-full border border-slate-800 bg-white p-1.5">
              {/* <Edit className="h-full w-full text-slate-800" /> */}
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center gap-2 text-sm">
            <h2>
              <span>Hi,</span>{" "}
              <span className="font-semibold">{user?.name}!</span>
            </h2>
            {/* <Badge>{user?.role.name}</Badge> */}
            {user?.email && (
              <span className="text-xs font-bold">{user?.email}</span>
            )}
          </div>
          <div className="mt-3 w-full py-2">
            <li
              onClick={() => logout()}
              className="mb-0.5 flex cursor-pointer items-center justify-start gap-2 rounded-3xl bg-white p-4 text-xs font-semibold transition duration-500 hover:bg-primary/10"
            >
              <LogOut className="h-5 w-5" />
              <p>Logout</p>
            </li>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
