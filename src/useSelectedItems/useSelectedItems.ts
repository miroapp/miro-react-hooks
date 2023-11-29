import { Item, SelectionUpdateEvent } from "@mirohq/websdk-types";
import { useState, useEffect } from "react";

import { useMiro } from "../useMiro/useMiro";

export type SelectItemsOpts = {
  predicate?: (items: Item) => boolean;
};

export const useSelectedItems = <T extends Item = Item>(opts?: SelectItemsOpts) => {
  const miro = useMiro();
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const subscribe = () => {
      const setFilteredItems = async (items: Item[]) => {
        let filteredItems = items as T[];
        if (opts?.predicate) {
          filteredItems = filteredItems.filter(opts.predicate);
        }
        setItems(filteredItems);
      };

      miro.board.getSelection().then(setFilteredItems);

      const handleSelectionUpdate = async (event: SelectionUpdateEvent) => {
        setFilteredItems(event.items);
      };

      miro.board.ui.on("selection:update", handleSelectionUpdate);

      return () => {
        miro.board.ui.off("selection:update", handleSelectionUpdate);
      };
    };

    return subscribe();
  }, [miro.board, miro.board.ui, opts?.predicate]);

  return items;
};
