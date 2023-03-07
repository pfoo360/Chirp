import {
  useState,
  useEffect,
  FC,
  MouseEvent,
  ChangeEvent,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import Schema from "@/schema/";
import trpc from "@/lib/trpc";
import useUser from "@/hooks/useUser";

interface UpdateChirp {
  id: string;
  originalText: string;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateChirp: FC<UpdateChirp> = ({ id, originalText, setIsFormOpen }) => {
  const userCtx = useUser();

  const utils = trpc.useContext();

  const [updateText, setUpdateText] = useState(originalText ?? "");
  const [chirpError, setChirpError] = useState(true);

  useEffect(() => {
    setChirpError(false);
    const r = Schema.ChirpSchema.safeParse(updateText);
    if (!r.success) setChirpError(true);
  }, [updateText]);

  const {
    isError,
    error,
    data,
    isLoading: isSubmitting,
    mutate,
  } = trpc.chirp.updateChirp.useMutation({
    onError: (error, variables, context) => {},
    onSuccess: (updatedChirp, variables, context) => {
      utils.chirp.readChirp.setInfiniteData(
        {
          userId: updatedChirp.user.id,
        },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          // data.pages.map((page) => {
          //   return page.chirps.map((chirp) => {
          //     if (chirp.id === updatedChirp.id) return updatedChirp;
          //     return chirp;
          //   });
          // });

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              chirps: page.chirps.map((chirp) =>
                chirp.id === updatedChirp.id ? updatedChirp : chirp
              ),
            })),
          };
        }
      );
      setUpdateText("");
      setChirpError(true);
      setIsFormOpen(false);
    },
  });

  const textAreaRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  const handleUpdateTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setUpdateText(e.target.value);
  };

  const handleFormClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (chirpError || isSubmitting) return;
    if (updateText === originalText) return setIsFormOpen(false);
    await mutate({ id, updateText });
  };

  if (!userCtx) return null;
  return (
    <form className="flex flex-col justify-center items-center">
      <textarea
        id="updateText"
        name="updateText"
        value={updateText}
        onChange={handleUpdateTextChange}
        disabled={isSubmitting}
        placeholder="What's happening?"
        required
        ref={textAreaRef}
        className={`w-full h-28 border border-gray-300 rounded-md px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500 resize-none`}
      />
      <div className="flex flex-row w-full justify-end mt-4">
        <button
          disabled={isSubmitting}
          onClick={handleFormClose}
          className="text-gray-50 text-lg font-medium px-6 py-2 mr-3 bg-gray-900 border rounded-l-full rounded-r-full hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 disabled:bg-gray-500"
        >
          Close
        </button>
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

export default UpdateChirp;
