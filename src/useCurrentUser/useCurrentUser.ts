import { useAsyncAbortable } from "@react-hookz/web";

import { useMiro } from "../useMiro/useMiro";
import { useEffect } from "react";

/**
 * Fetches current user from Miro
 */
export const useCurrentUser = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getUserInfo());

  useEffect(() => {
    actions.execute();
  }, [actions]);

  return {
    ...state,
    ...actions,
  };
};
