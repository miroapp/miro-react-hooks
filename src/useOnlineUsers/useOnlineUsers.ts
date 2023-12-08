import { useEffect } from "react";
import { useAsyncAbortable } from "@react-hookz/web";

import { useMiro } from "../useMiro";

/**
 * Fetches list of online users from Miro and reacts to changes
 */
export const useOnlineUsers = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getOnlineUsers(), []);

  useEffect(() => {
    miro.board.ui.on("online_users:update", actions.execute);

    actions.execute();

    return () => {
      miro.board.ui.off("online_users:update", actions.execute);
    };
  }, [miro.board.ui, actions]);

  return {
    ...state,
    ...actions,
  };
};
