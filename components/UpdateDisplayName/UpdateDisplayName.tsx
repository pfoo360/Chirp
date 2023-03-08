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

interface UpdateDisplayNameProps {
  children: JSX.Element;
  userId: string;
  displayName: string;
}

const UpdateDisplayName: FC<UpdateDisplayNameProps> = ({
  children,
  userId,
  displayName,
}) => {
  const utils = trpc.useContext();

  const userCtx = useUser();

  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState(
    displayName || ""
  );
  const [updatedDisplayNameError, setUpdatedDisplayNameError] = useState(true);

  const {
    isLoading: isSubmitting,
    mutate,
    isError,
    error,
  } = trpc.user.updateUsersDisplayName.useMutation({
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {
      utils.user.readUsersBio.setData({ userId: data.id }, (cache) => {
        if (!cache) return;
        return { ...cache, displayName: data.displayName };
      });

      utils.chirp.readChirp.setInfiniteData({ userId: data.id }, (cache) => {
        if (!cache) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        return {
          ...cache,
          pages: cache.pages.map((page) => ({
            ...page,
            chirps: page.chirps.map((chirp) => {
              if (chirp.user.id === data.id) {
                return {
                  ...chirp,
                  user: { ...chirp.user, displayName: data.displayName },
                };
              }
              return chirp;
            }),
          })),
        };
      });

      setUpdatedDisplayName(data.displayName);
      setIsEditFormOpen(false);
    },
  });

  useEffect(() => {
    if (!userCtx?.id) return setIsLoggedInUser(false);
    if (userId === userCtx.id) setIsLoggedInUser(true);
    return () => setIsLoggedInUser(false);
  }, [userId, userCtx?.id]);

  useEffect(() => {
    setUpdatedDisplayNameError(false);
    const r = Schema.DisplayNameSchema.safeParse(updatedDisplayName);
    if (!r.success) setUpdatedDisplayNameError(true);

    return () => setUpdatedDisplayNameError(true);
  }, [updatedDisplayName]);

  const inputRef = useCallback((node: HTMLInputElement | null) => {
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
    setUpdatedDisplayName(displayName);
  };
  const handleUpdateDisplayNameInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (isSubmitting) return;
    setUpdatedDisplayName(e.target.value);
  };
  const handleSubmit = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (updatedDisplayNameError) return;
    if (userId !== userCtx?.id) return;
    if (isSubmitting) return;
    if (updatedDisplayName === displayName) {
      setUpdatedDisplayName(displayName);
      setIsEditFormOpen(false);
      return;
    }

    mutate({ updatedDisplayName, userId });
  };

  if (!isLoggedInUser) return children;
  if (!isEditFormOpen && isLoggedInUser)
    return (
      <div className="flex flex-row items-baseline">
        {children}
        <div
          onClick={handleOpenEditForm}
          className="text-sm ml-[2px] text-gray-400 hover:underline decoration-dotted hover:cursor-pointer hover:text-sky-400"
        >
          update
        </div>
      </div>
    );

  if (isEditFormOpen && isLoggedInUser)
    return (
      <form className="flex flex-row items-center">
        <input
          type="text"
          id="updatedDisplayName"
          name="updatedDisplayName"
          value={updatedDisplayName}
          onChange={handleUpdateDisplayNameInputChange}
          ref={inputRef}
          disabled={isSubmitting}
          className={`font-bold text-3xl w-4/5 my-2 text-gray-900 bg-transparent border-0 border-b appearance-none focus:outline-none disabled:text-gray-200 ${
            !updatedDisplayNameError ? "border-sky-300" : "border-rose-500"
          }`}
        />

        <div
          className="text-sm ml-3 text-gray-400 hover:underline decoration-dotted hover:cursor-pointer hover:text-sky-400"
          onClick={handleCloseEditForm}
        >
          close
        </div>
        <div
          className={`text-sm ml-2 hover:underline decoration-dotted hover:cursor-pointer ${
            updatedDisplayNameError
              ? "text-rose-500 hover:text-rose-500"
              : "text-gray-400 hover:text-sky-400"
          }`}
          onClick={handleSubmit}
        >
          update
        </div>
      </form>
    );

  return children;
};

export default UpdateDisplayName;
