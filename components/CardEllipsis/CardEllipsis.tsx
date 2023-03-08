import { MouseEvent, useState, FC, Dispatch, SetStateAction } from "react";
import DeleteChirp from "@/components/DeleteChirp/DeleteChirp";
import UpdateChirpBtn from "@/components/UpdateChirpBtn/UpdateChirpBtn";
import useUser from "@/hooks/useUser";

interface CardEllipsisProps {
  id: string;
  author: { id: string; username: string; displayName: string };
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

const CardEllipsis: FC<CardEllipsisProps> = ({ id, author, setIsFormOpen }) => {
  const userCtx = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardEllipsis = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  if (userCtx?.id !== author.id) return null;
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
            <DeleteChirp id={id} authorId={author.id} />
            <UpdateChirpBtn
              authorId={author.id}
              setIsFormOpen={setIsFormOpen}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export default CardEllipsis;
