import { createContext, useContext } from "react";
import { RouterOutputs } from "@/types";

type Chirp = RouterOutputs["chirp"]["readChirp"]["chirps"][0];

const CardContext = createContext<{ chirp: Chirp } | null>(null);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context)
    throw new Error("Must be rendered as a child of Card component.");
  return context;
};

export default CardContext;
