import { RouterOutputs } from "@/types/";
import { forwardRef } from "react";
import CardContext from "@/components/Card/CardContext";
import UpdateChirp from "@/components/UpdateChirp/UpdateChirp";
import CardContent from "@/components/Card/CardContent";

type Chirp = RouterOutputs["chirp"]["readChirp"]["chirps"][0];

interface CardProps {
  chirp: Chirp;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Component(
  { chirp },
  ref
) {
  const content = (
    <CardContext.Provider value={{ chirp }}>
      <UpdateChirp>
        <CardContent />
      </UpdateChirp>
    </CardContext.Provider>
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
});

export default Card;
