import { useState } from "react";
import Link from "next/link";
import moment from "moment";
import { RouterOutputs } from "@/types/";
import { forwardRef } from "react";
import CardEllipsis from "@/components/CardEllipsis/CardEllipsis";
import UpdateChirpForm from "@/components/UpdateChirpForm/UpdateChirpForm";

type Chirp = RouterOutputs["chirp"]["readChirp"]["chirps"][0];

interface CardProps {
  chirp: Chirp;
  //ref?: (node: HTMLDivElement | null) => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ chirp: { id, chirp, user, createdAt, updatedAt } }, ref) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const content = !isFormOpen ? (
      <>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row items-center">
            <Link
              href={`/c/${user.username}`}
              className="font-bold text-gray-900 hover:underline text-base"
            >
              {user.displayName}
            </Link>
            <p className="text-gray-600 ml-1">{`@${user.username}`}</p>
            <span className="mx-1 text-gray-600">·</span>
            {createdAt === updatedAt ? (
              <p className="text-gray-600 hover:underline">
                {moment(createdAt).format("MMM DD")}
              </p>
            ) : (
              <>
                <p className="text-gray-600 hover:underline">
                  {moment(createdAt).format("MMM DD")}
                </p>
                <p className="text-gray-600 opacity-50 text-xs italic pl-1">
                  {`updated ${moment(updatedAt).format("MMM DD")}`}
                </p>
              </>
            )}
          </div>
          <CardEllipsis id={id} author={user} setIsFormOpen={setIsFormOpen} />
        </div>
        <p className="text-gray-900 pb-2 break-all">{chirp}</p>
      </>
    ) : (
      <UpdateChirpForm
        id={id}
        originalText={chirp}
        setIsFormOpen={setIsFormOpen}
      />
    );

    if (ref)
      return (
        <div
          ref={ref}
          className="w-full border-t border-gray-200 bg-gray-50 hover:bg-gray-100 px-5 py-3"
        >
          {content}
        </div>
      );
    return (
      <div className="w-full border-t border-gray-200 bg-gray-50 hover:bg-gray-100 px-5 py-3">
        {content}
      </div>
    );
  }
);

export default Card;
