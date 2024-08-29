import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonProps } from "../components/ui/button";

interface SideButton extends ButtonProps {
  icon?: LucideIcon;
  Link: string;
  MenuClose?: (data: boolean) => void;
}

export default function SideNavBarButton({
  icon: Icon,
  className,
  children,
  Link,
  MenuClose,
  ...props
}: SideButton) {
  const Navigate = useNavigate();
  const MenuClick = (Link: string) => {
    Navigate(Link);
    if (MenuClose !== undefined) {
      MenuClose(false);
    }
  };
  return (
    <Button
      onClick={() => MenuClick(Link)}
      className={cn("gap-2 w-full overflow-hidden flex justify-start", className)}
      {...props}
    >
      <div>{Icon && <Icon />}</div>
      <span>{children}</span>
    </Button>
  );
}
