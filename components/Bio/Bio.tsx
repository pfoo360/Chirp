import { FC } from "react";
import trpc from "@/lib/trpc";
import Error from "@/components/Error/Error";
import moment from "moment";
import UpdateDisplayName from "@/components/UpdateDisplayName/UpdateDisplayName";
import UpdateDescription from "@/components/UpdateDescription/UpdateDescription";

interface BioProps {
  username: { id: string };
}

const Bio: FC<BioProps> = ({ username }) => {
  const { data, error, isLoading, isError } = trpc.user.readUsersBio.useQuery({
    userId: username.id,
  });

  if (isLoading)
    return (
      <div className="flex flex-row justify-center items-center my-6">
        <p className="text-gray-900 text-sm">loading...</p>
      </div>
    );

  if (!isLoading && isError) return <Error text={error.message} />;

  return (
    <section className="px-5 pb-4">
      <UpdateDisplayName userId={data.id} displayName={data.displayName}>
        <h3 className="font-bold text-3xl my-2 tex-gray-900">
          {data.displayName}
        </h3>
      </UpdateDisplayName>
      <h4 className="text-gray-500 text-base mb-4">{`@${data.username}`}</h4>
      <UpdateDescription userId={data.id} description={data.description}>
        <p className="break-words text-gray-900 text-base mb-5">
          {data.description}
        </p>
      </UpdateDescription>
      <p className="break-all text-gray-400 text-sm mb-9">
        {`Joined ${moment(data.createdAt).format("MMMM YYYY")}`}
      </p>
      <div className="w-full h-px bg-gray-200 opacity-50"></div>
    </section>
  );
};

export default Bio;
