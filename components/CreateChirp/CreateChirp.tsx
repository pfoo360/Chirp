import { useState, useEffect, FC, MouseEvent, ChangeEvent } from "react";
import Schema from "@/schema/";
import trpc from "@/lib/trpc";
import useUser from "@/hooks/useUser";
import ChirpSchema from "@/schema/chirp";

const CreateChirp: FC = () => {
  const userCtx = useUser();

  const utils = trpc.useContext();

  const [chirp, setChirp] = useState("");
  const [chirpError, setChirpError] = useState(true);

  useEffect(() => {
    setChirpError(false);
    const r = Schema.ChirpSchema.safeParse(chirp);
    if (!r.success) setChirpError(true);
  }, [chirp]);

  const {
    isError,
    error,
    data,
    isLoading: isSubmitting,
    mutate,
  } = trpc.chirp.createChirp.useMutation({
    onError: (error, variables, context) => {},
    onSuccess: (createdChirp, variables, context) => {
      utils.chirp.readChirp.setInfiniteData(
        {
          userId: createdChirp.user.id,
        },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          data.pages[0].chirps.unshift(createdChirp);

          return {
            ...data,
          };
        }
      );
      setChirp("");
      setChirpError(true);
    },
  });

  const handleChirpInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setChirp(e.target.value);
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (chirpError || isSubmitting) return;
    await mutate({ chirp });
  };

  if (!userCtx) return null;
  return (
    <form className="flex flex-col justify-center items-center px-5">
      <textarea
        id="chirp"
        name="chirp"
        value={chirp}
        onChange={handleChirpInputChange}
        disabled={isSubmitting}
        placeholder="What's happening?"
        required
        className={`w-full h-28 resize-none border border-gray-300 rounded-md mt-6 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500`}
      />
      <div className="flex flex-row w-full justify-end my-4">
        <button
          type="submit"
          disabled={chirpError || isSubmitting}
          onClick={handleSubmit}
          className="text-gray-50 text-lg font-medium px-6 py-2 bg-sky-500 border rounded-l-full rounded-r-full hover:bg-sky-400 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300 disabled:bg-sky-200"
        >
          Chirp
        </button>
      </div>
    </form>
  );
};

export default CreateChirp;
