import { router } from "../../trpc";
import signIn from "./functions/signIn";
import signOut from "./functions/signOut";

const authRouter = router({
  signIn,
  signOut,
});

export default authRouter;
