import { useAsyncAbortable } from "@react-hookz/web";
import { useCallback, useEffect, useMemo } from "react";
import { Json } from "@mirohq/websdk-types";

import { useMiro } from "../useMiro";

/**
 * Interacts with Miro storage
 */
export const useStorage = <Value extends Json>(collection: string, key: string) => {
  const miro = useMiro();
  const miroCollection = useMemo(
    () => miro.board.storage.collection(collection),
    [collection, miro.board.storage],
  );
  const [state, actions] = useAsyncAbortable(() => miroCollection.get(key));

  useEffect(() => {
    miroCollection.onValue(key, actions.execute);

    actions.execute();

    return () => {
      miroCollection.offValue(key, actions.execute);
    };
  }, [miroCollection, actions, key]);

  const set = useCallback(
    async (value: Value) => {
      await miroCollection.set(key, value);
    },
    [miroCollection, key],
  );

  const remove = useCallback(async () => {
    await miroCollection.remove(key);
  }, [miroCollection, key]);

  return {
    ...state,
    ...actions,
    collection: miroCollection,
    set,
    remove,
  };
};
