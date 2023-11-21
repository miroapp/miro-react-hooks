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
      const handleSelectionUpdate = async (event: SelectionUpdateEvent) => {
        let items = event.items as T[];
        if (opts?.predicate) {
          items = items.filter(opts.predicate);
        }
        setItems(items);
      };

      miro.board.ui.on("selection:update", handleSelectionUpdate);

      return () => {
        miro.board.ui.off("selection:update", handleSelectionUpdate);
      };
    };

    return subscribe();
  }, []);

  return items;
};
