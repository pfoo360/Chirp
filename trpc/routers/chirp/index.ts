import { router } from "../../trpc";
import createChirp from "./functions/createChirp";
import readChirp from "./functions/readChirp";
import updateChirp from "./functions/updateChirp";
import deleteChirp from "./functions/deleteChirp";

const chirpRouter = router({
  createChirp,
  readChirp,
  updateChirp,
  deleteChirp,
});

export default chirpRouter;
