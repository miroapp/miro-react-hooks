import { renderHook, act } from "@testing-library/react-hooks";

import { useViewport } from "./useViewport";
import { wrapper, miro, buildItem } from "../tests";

describe("useInfo", () => {
  let rect = {
    y: 10,
    x: 20,
    width: 8000,
    height: 6000,
  };
  let zoomLevel = 10;

  beforeEach(() => {
    jest.spyOn(miro.board.viewport, "get").mockImplementation(() => Promise.resolve(rect));
    jest.spyOn(miro.board.viewport, "set").mockImplementation(async (newRect) => {
      rect = newRect.viewport;
      return rect;
    });
    jest.spyOn(miro.board.viewport, "setZoom").mockImplementation(async (newZoom) => {
      zoomLevel = newZoom;
    });
    jest.spyOn(miro.board.viewport, "getZoom").mockImplementation(() => Promise.resolve(zoomLevel));
  });

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useViewport());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current viewport info", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useViewport(), {
      wrapper,
      initialProps: { miro },
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

  it("handles error", async () => {
    const error = new Error("Something wrong");

    jest.spyOn(miro.board.viewport, "get").mockImplementation(() => Promise.reject(error));

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

    const shape = buildItem();
    act(() => {
      result.current.zoomTo(shape);
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

    const info = {
      ...rect,
      zoomLevel,
    };

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });
});
