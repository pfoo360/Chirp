import { FC, MouseEvent, Dispatch, SetStateAction } from "react";
import useUser from "@/hooks/useUser";

interface UpdateChirpProps {
  authorId: string;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateChirp: FC<UpdateChirpProps> = ({ authorId, setIsFormOpen }) => {
  const userCtx = useUser();

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFormOpen(true);
  };

  if (!userCtx?.id) return null;
  if (userCtx.id !== authorId) return null;
  return (
    <div
      onClick={handleClick}
      className="bg-white hover:bg-gray-100 hover:cursor-pointer rounded-b-xl font-bold text-gray-900 text-lg px-11 py-2"
    >
      Update
    </div>
  );
};

export default UpdateChirp;
