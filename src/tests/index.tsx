import React, { FC, PropsWithChildren } from "react";

import { MiroProvider } from "../context";
import { Miro } from "@mirohq/websdk-types";

export * from "./miro";

export const wrapper: FC<PropsWithChildren<{ miro: Miro }>> = ({ children, miro }) => (
  <MiroProvider miro={miro}>{children}</MiroProvider>
);
