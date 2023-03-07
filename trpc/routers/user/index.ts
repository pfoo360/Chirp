import { router } from "../../trpc";
import createAccount from "./functions/createAccount";
import readUsersBio from "./functions/readUsersBio";
import updateUsersDisplayName from "./functions/updateUsersDisplayName";
import updateUsersDescription from "./functions/updateUsersDescription";

const userRouter = router({
  createAccount,
  readUsersBio,
  updateUsersDisplayName,
  updateUsersDescription,
});

export default userRouter;
