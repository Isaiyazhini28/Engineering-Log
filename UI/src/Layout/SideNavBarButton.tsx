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
  const navigate = useNavigate();
  const menuClick = (link: string) => {
    navigate(link);
    if (MenuClose) {
      MenuClose(false);
    }
  };

  return (
    <Button
      onClick={() => menuClick(Link)}
      className={cn(
        "gap-2 w-full overflow-hidden flex justify-start text-white", // Ensure both icon and text are white
        className
      )}
      {...props}
    >
      <div>{Icon && <Icon className="text-white" />}</div> {/* Set icon color to white */}
      <span>{children}</span> {/* Text will inherit the white color */}
    </Button>
  );
}
