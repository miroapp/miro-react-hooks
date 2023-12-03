import { renderHook, act } from "@testing-library/react-hooks";

import { useViewport } from "./useViewport";
import { wrapper, miro, buildItem } from "../test-utils";

describe("useInfo", () => {
  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useViewport());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current viewport info", async () => {
    const viewport = await miro.board.viewport.get();
    const zoomLevel = await miro.board.viewport.getZoom();

    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    const info = {
      ...viewport,
      zoomLevel,
    };

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });

  it("handles error", async () => {
    const error = new Error("Something wrong");

    jest.spyOn(miro.board.viewport, "get").mockImplementationOnce(() => Promise.reject(error));

    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatchObject(error);
    expect(result.current.result).toBeUndefined();
  });

  it("sets viewport", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
    });

    const zoomLevel = await miro.board.viewport.getZoom();
    const rect = {
      y: 99,
      x: 35,
      width: 700,
      height: 400,
    };

    act(() => {
      result.current.set({
        viewport: rect,
      });
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    const info = {
      ...rect,
      zoomLevel,
    };

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });

  it("zoomTo", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
    });

    const shape = buildItem({
      x: 20,
      y: 30,
      width: 200,
      height: 100,
    });

    act(() => {
      result.current.zoomTo(shape);
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    const viewport = await miro.board.viewport.get();
    const zoomLevel = await miro.board.viewport.getZoom();

    const info = {
      ...viewport,
      zoomLevel,
    };

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });

  it("setZoom", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
    });

    act(() => {
      result.current.setZoom(3);
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    const viewport = await miro.board.viewport.get();
    const zoomLevel = await miro.board.viewport.getZoom();

    const info = {
      ...viewport,
      zoomLevel,
    };

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });
});
