

import Login from "@/pages/Login";
import { PropsWithChildren, useState } from "react";

const Authenticated = ({ children }: PropsWithChildren) => {
  const [cookie, setCookie] = useState(sessionStorage.getItem("UserDetails"));



  return Boolean(cookie) ? (
    <Login />
  ) : (
    <>
      {children}
    </>
  );
};

export default Authenticated;