import { UserCtx } from "@/context/userProvider";
import { useContext } from "react";

const useUser = () => {
  return useContext(UserCtx);
};

export default useUser;
