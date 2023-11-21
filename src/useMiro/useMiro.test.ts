import { useContext } from "react";
import { Miro } from "@mirohq/websdk-types";
import { MiroContext } from "../context";

export const useMiro = (): Miro => {
  const { miro } = useContext(MiroContext);
  if (!miro) {
    throw new Error("Miro instance needs to be injected with MiroProvider");
  }

  return miro;
};
