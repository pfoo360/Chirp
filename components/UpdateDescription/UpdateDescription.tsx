import {
  FC,
  useState,
  useEffect,
  MouseEvent,
  ChangeEvent,
  useCallback,
} from "react";
import useUser from "@/hooks/useUser";
import Schema from "@/schema/";
import trpc from "@/lib/trpc";

interface UpdateDescriptionProps {
  children: JSX.Element;
  userId: string;
  description: string | null;
}

const UpdateDescription: FC<UpdateDescriptionProps> = ({
  children,
  userId,
  description,
}) => {
  const utils = trpc.useContext();

  const userCtx = useUser();

  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDescriptionError, setNewDescriptionError] = useState(true);

  const {
    isLoading: isSubmitting,
    mutate,
    isError,
    error,
  } = trpc.user.updateUsersDescription.useMutation({
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {
      utils.user.readUsersBio.setData({ userId: data.id }, (cache) => {
        if (!cache) return;
        return { ...cache, description: data.description };
      });

      setNewDescription(data.description || "");
      setIsEditFormOpen(false);
    },
  });

  useEffect(() => {
    if (!userCtx?.id) return setIsLoggedInUser(false);
    if (userId === userCtx.id) setIsLoggedInUser(true);
    return () => setIsLoggedInUser(false);
  }, [userId, userCtx?.id]);

  useEffect(() => {
    setNewDescriptionError(false);
    const r = Schema.DescriptionSchema.safeParse(newDescription);
    if (!r.success) setNewDescriptionError(true);

    return () => setNewDescriptionError(true);
  }, [newDescription]);

  const inputRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  const handleOpenEditForm = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsEditFormOpen(true);
  };
  const handleCloseEditForm = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsEditFormOpen(false);
    setNewDescription(description || "");
  };
  const handleNewDescriptionInputChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (isSubmitting) return;
    setNewDescription(e.target.value);
  };
  const handleSubmit = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (newDescriptionError) return;
    if (userId !== userCtx?.id) return;
    if (isSubmitting) return;
    if (newDescription === description) {
      setNewDescription(description);
      setIsEditFormOpen(false);
      return;
    }
    mutate({ userId, newDescription });
  };

  if (!isLoggedInUser) return children;
  if (!isEditFormOpen && isLoggedInUser)
    return (
      <div className="flex flex-col">
        {children}
        <div className="flex flex-row justify-end w-full mb-5">
          <div
            onClick={handleOpenEditForm}
            className="text-sm ml-1 text-gray-400 hover:underline decoration-dotted hover:cursor-pointer hover:text-sky-400"
          >
            update
          </div>
        </div>
      </div>
    );

  if (isEditFormOpen && isLoggedInUser)
    return (
      <form className="flex flex-col justify-center">
        <textarea
          id="newDescription"
          name="newDescription"
          value={newDescription}
          onChange={handleNewDescriptionInputChange}
          ref={inputRef}
          disabled={isSubmitting}
          placeholder="Add a description"
          className={`text-base w-full h-20 resize-none border rounded-md px-2 py-[3px] mb-4 placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 ${
            !newDescriptionError
              ? "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
              : "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
          }`}
        />
        <div className="flex flex-row justify-end mb-5">
          <div
            className="text-sm ml-3 text-gray-400 hover:underline decoration-dotted hover:cursor-pointer hover:text-sky-400"
            onClick={handleCloseEditForm}
          >
            close
          </div>
          <div
            className={`text-sm ml-2 hover:underline decoration-dotted hover:cursor-pointer ${
              newDescriptionError
                ? "text-rose-500 hover:text-rose-500"
                : "text-gray-400 hover:text-sky-400"
            }`}
            onClick={handleSubmit}
          >
            update
          </div>
        </div>
      </form>
    );

  return children;
};

export default UpdateDescription;
