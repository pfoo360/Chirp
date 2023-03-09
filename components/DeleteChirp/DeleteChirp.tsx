import { FC, MouseEvent } from "react";
import trpc from "@/lib/trpc";
import useUser from "@/hooks/useUser";
import { useCardContext } from "@/components/Card/CardContext";

const DeleteChirp: FC = () => {
  const userCtx = useUser();
  const {
    chirp: {
      id,
      user: { id: authorId },
    },
  } = useCardContext();
  const utils = trpc.useContext();
  const {
    mutate,
    isError,
    error,
    isLoading: isSubmitting,
  } = trpc.chirp.deleteChirp.useMutation({
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {
      const { id: deletedChirpId } = data;
      utils.chirp.readChirp.setInfiniteData(
        {
          userId: authorId,
        },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              chirps: page.chirps.filter(
                (chirp) => chirp.id !== deletedChirpId
              ),
            })),
          };
        }
      );
    },
  });

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    mutate({ id });
  };

  if (!userCtx?.id) return null;
  if (userCtx.id !== authorId) return null;
  return (
    <div
      onClick={handleClick}
      className="bg-white hover:bg-gray-100 hover:cursor-pointer rounded-t-xl font-bold text-gray-900 text-lg px-11 py-2"
    >
      Delete
    </div>
  );
};

export default DeleteChirp;
