import { createContext, FC } from "react";
import { Miro } from "@mirohq/websdk-types";

export type MiroContext = {
  miro: Miro;
};

export const MiroContext = createContext<MiroContext>();

export const MiroProvider: FC<MiroContext> = ({ children, miro }) => {
  return (
    <MiroContext.Provider value={{ miro }}>{children}</MiroContext.Provider>
  );
};
