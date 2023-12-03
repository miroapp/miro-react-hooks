import { Item } from "@mirohq/websdk-types";
import { useEffect, useMemo } from "react";
import { useAsyncAbortable } from "@react-hookz/web";

import { useMiro } from "../useMiro/useMiro";

export type SelectItemsOpts = {
  predicate?: (item: Item) => boolean;
};

/**
 * Fetches currently selected items on the Miro board and reacts to changes
 */
export const useSelectedItems = <T extends Item = Item>(opts?: SelectItemsOpts) => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(() => miro.board.getSelection(), []);

  useEffect(() => {
    const subscribe = () => {
      miro.board.ui.on("selection:update", actions.execute);

      return () => {
        miro.board.ui.off("selection:update", actions.execute);
      };
    };

    actions.execute();

    return subscribe();
  }, [miro.board.ui, actions]);

  const result = useMemo(() => {
    let filteredItems = state.result as T[];
    if (opts?.predicate) {
      return filteredItems.filter(opts.predicate);
    }

    return filteredItems;
  }, [state.result, opts?.predicate]);

  return {
    ...state,
    ...actions,
    result,
  };
};
