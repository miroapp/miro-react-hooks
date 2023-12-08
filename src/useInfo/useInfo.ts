import { useAsyncAbortable, useMountEffect } from "@react-hookz/web";

import { useMiro } from "../useMiro";

/**
 * Fetches current Miro board info
 */
export const useInfo = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getInfo());

  useMountEffect(actions.execute);

  return {
    ...state,
    ...actions,
  };
};
