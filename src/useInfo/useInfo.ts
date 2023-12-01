import { useAsyncAbortable } from "@react-hookz/web";

import { useMiro } from "../useMiro/useMiro";
import { useEffect } from "react";

/**
 * Fetches current Miro board info
 * @returns
 */
export const useInfo = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getInfo());

  useEffect(() => {
    actions.execute();
  }, [actions]);

  return {
    ...state,
    ...actions,
  };
};
