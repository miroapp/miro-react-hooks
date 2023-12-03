import { renderHook } from "@testing-library/react-hooks";

import { useSelectedItems } from "./useSelectedItems";
import { buildItem, buildMiro, wrapper } from "../test-utils";

describe("useSelectedItems", () => {
  const shapes = Array.from({ length: 5 }).map((_, id) =>
    buildItem({
      id: id.toString(),
      type: "shape",
    }),
  );

  const stickies = Array.from({ length: 5 }).map((_, id) =>
    buildItem({
      id: id.toString(),
      type: "sticky_note",
    }),
  );

  const items = [...shapes, stickies];

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useSelectedItems());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns selected items empty", async () => {
    const miro = buildMiro({
      board: {
        getSelection: jest.fn(() => Promise.resolve([])),
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useSelectedItems(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    expect(miro.board.getSelection).toHaveBeenCalled();
  });

  it("returns selected items", async () => {
    const miro = buildMiro({
      board: {
        getSelection: jest.fn(() => Promise.resolve(items)),
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useSelectedItems(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(items);

    expect(miro.board.getSelection).toHaveBeenCalled();
  });

  it("returns selected filtered shapes", async () => {
    const miro = buildMiro({
      board: {
        getSelection: jest.fn(() => Promise.resolve(items)),
      },
    });

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useSelectedItems({
          predicate: (item) => item.type === "shape",
        }),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(shapes);

    expect(miro.board.getSelection).toHaveBeenCalled();
  });

  it("handles error", async () => {
    const error = new Error("Something wrong");
    const miro = buildMiro({
      board: {
        getSelection: jest.fn(() => Promise.reject(error)),
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useSelectedItems(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatchObject(error);
    expect(result.current.result).toMatchObject([]);
  });
});
