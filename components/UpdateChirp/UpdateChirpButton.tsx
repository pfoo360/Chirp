import { FC, MouseEvent } from "react";
import useUser from "@/hooks/useUser";
import { useUpdateChirpContext } from "@/components/UpdateChirp/UpdateChirpContext";
import { useCardContext } from "@/components/Card/CardContext";

const UpdateChirpButton: FC = () => {
  const userCtx = useUser();
  const { setIsFormOpen } = useUpdateChirpContext();
  const {
    chirp: {
      user: { id: authorId },
    },
  } = useCardContext();

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

export default UpdateChirpButton;
