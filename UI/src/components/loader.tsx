import logo from "../assets/Loader1.gif";
import { Dialog, DialogContent } from "./Loader-dialog";
import { DialogHeader, DialogTitle } from "./ui/dialog";

export function Loader() {
  return (
    <Dialog open={true}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="h-[100dvh] min-w-[100%] border-none bg-gray-500/50 pt-10">
        <div className="flex h-[100vh] w-[100vw] items-center justify-center absolute z-[100] inset-0">
          <div className="w-[250px] h-[250px] rounded-sm flex items-center justify-center flex-col text-white text-2xl">
            <img src={logo} alt="@shadcn" className="w-[40%]" />
            <>Loading...</>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
