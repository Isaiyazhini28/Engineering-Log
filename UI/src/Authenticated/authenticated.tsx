import Login from "@/Pages/Login";
import { setAuthIncerceptor } from "@/services/api";
import { PropsWithChildren, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const Authenticated = ({ children }: PropsWithChildren<object>) => {
  const [cookie, setCookie] = useState<string>("");

  if (
    Boolean(cookie !== undefined && cookie.trim() !== "" && cookie !== null)
  ) {
    setAuthIncerceptor(cookie);
  }
  useEffect(() => {
    // Check session storage for user details on component mount
    const userDetails = sessionStorage.getItem("token");
    if (Boolean(userDetails)) {
      setCookie(userDetails);
    }
  }, []);

  // Render Login component if no cookie is found, otherwise render children
  return !cookie ? <Login /> : <>{children}</>;
};

export default Authenticated;