import { useAsyncAbortable } from "@react-hookz/web";

import { useMiro } from "../useMiro/useMiro";
import { useCallback, useEffect } from "react";
import { BoardViewport } from "@mirohq/websdk-types";

/** @todo: re-export these types from @mirohq/sdk-types */
type SetViewporOpts = Parameters<BoardViewport["set"]>[0];
type ZoomToOpts = Parameters<BoardViewport["zoomTo"]>[0];
type SetZoomOpts = Parameters<BoardViewport["setZoom"]>[0];

/**
 * Fetches Miro board viewport and zoom level
 * @returns
 */
export const useViewport = () => {
  const miro = useMiro();
  const [state, actions] = useAsyncAbortable(async () => {
    const viewport = await miro.board.viewport.get();
    const zoomLevel = await miro.board.viewport.getZoom();
    return {
      ...viewport,
      zoomLevel,
    };
  });

  useEffect(() => {
    actions.execute();
  }, [actions]);

  const set = useCallback(
    async (opts: SetViewporOpts) => {
      await miro.board.viewport.set(opts);
      actions.execute();
    },
    [miro, actions],
  );

  const zoomTo = useCallback(
    async (items: ZoomToOpts) => {
      await miro.board.viewport.zoomTo(items);
      actions.execute();
    },
    [miro, actions],
  );

  const setZoom = useCallback(
    async (zoomLevel: SetZoomOpts) => {
      await miro.board.viewport.setZoom(zoomLevel);
      actions.execute();
    },
    [miro, actions],
  );

  return {
    ...state,
    ...actions,
    set,
    zoomTo,
    setZoom,
  };
};
