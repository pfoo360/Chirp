import { FC } from "react";
import { useCardContext } from "@/components/Card/CardContext";
import Link from "next/link";
import moment from "moment";
import CardEllipsis from "@/components/CardEllipsis/CardEllipsis";

const CardContent: FC = () => {
  const {
    chirp: { id, chirp, user, createdAt, updatedAt },
  } = useCardContext();

  return (
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
        <CardEllipsis />
      </div>
      <p className="text-gray-900 pb-2 break-all">{chirp}</p>
    </>
  );
};

export default CardContent;
