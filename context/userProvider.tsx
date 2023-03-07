import { User } from "@/types";
import { createContext, useEffect, useState } from "react";

export const UserCtx = createContext<null | User>(null);

const UserProvider = ({
  children,
  value,
}: {
  children: JSX.Element;
  value: User | null;
}) => {
  const [user, setUser] = useState(value);

  useEffect(() => {
    setUser(value);
  }, [value]);

  return <UserCtx.Provider value={user}>{children}</UserCtx.Provider>;
};

export default UserProvider;
