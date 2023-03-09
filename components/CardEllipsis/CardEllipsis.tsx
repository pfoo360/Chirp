import { MouseEvent, useState, FC } from "react";
import DeleteChirp from "@/components/DeleteChirp/DeleteChirp";
import UpdateChirp from "@/components/UpdateChirp/UpdateChirp";
import useUser from "@/hooks/useUser";
import { useCardContext } from "@/components/Card/CardContext";

const CardEllipsis: FC = () => {
  const userCtx = useUser();
  const {
    chirp: {
      user: { id: authorId },
    },
  } = useCardContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardEllipsis = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  if (userCtx?.id !== authorId) return null;
  return (
    <>
      <div
        onClick={handleCardEllipsis}
        className="group flex flex-row justify-center items-center hover:bg-sky-200 w-8 h-8 rounded-full"
      >
        <div className="bg-gray-800 group-hover:bg-sky-400 w-1 h-1 rounded-full mx-[1px] group-hover:"></div>
        <div className="bg-gray-800 group-hover:bg-sky-400 w-1 h-1 rounded-full mx-[1px]"></div>
        <div className="bg-gray-800 group-hover:bg-sky-400 w-1 h-1 rounded-full mx-[1px]"></div>
      </div>
      {isOpen ? (
        <>
          <div
            onClick={handleCardEllipsis}
            className="fixed inset-0 z-[1000]"
          />
          <div className="absolute z-[1000] rounded-xl border drop-shadow-xl right-8">
            <DeleteChirp />
            <UpdateChirp.Button />
          </div>
        </>
      ) : null}
    </>
  );
};

export default CardEllipsis;
