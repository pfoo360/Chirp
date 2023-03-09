import { createContext, useContext, Dispatch, SetStateAction } from "react";

const UpdateChirpContext = createContext<{
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const useUpdateChirpContext = () => {
  const context = useContext(UpdateChirpContext);
  if (!context)
    throw new Error("Must be rendered as a child of UpdateChirp component");
  return context;
};

export default UpdateChirpContext;
