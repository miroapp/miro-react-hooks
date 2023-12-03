import { useAsyncAbortable, useMountEffect } from "@react-hookz/web";

import { useMiro } from "../useMiro/useMiro";

/**
 * Fetches current user from Miro
 */
export const useCurrentUser = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getUserInfo());

  useMountEffect(actions.execute);

  return {
    ...state,
    ...actions,
  };
};
