import { renderHook, act } from "@testing-library/react-hooks";

import { useStorage } from "./useStorage";
import { wrapper, miro, storage } from "../test-utils";

describe("useStorage", () => {
  afterEach(() => {
    storage.clear();
  });

  const collectionName = "my-collection";
  const collectionKey = "";
  const data = {
    id: 23213,
    enabled: true,
    items: ["item-1", "item-2"],
    flags: {
      current: false,
    },
  };

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useStorage(collectionName, collectionKey));
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns empty value", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStorage(collectionName, collectionKey),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();
  });

  it("returns default value", async () => {
    await act(async () => {
      const collection = miro.board.storage.collection(collectionName);
      await collection.set(collectionKey, data);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useStorage(collectionName, collectionKey),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(data);
  });

  it("returns updated value", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStorage(collectionName, collectionKey),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    const collection = miro.board.storage.collection(collectionName);
    await collection.set(collectionKey, "new data");

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBe("new data");
  });

  it("updates value", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStorage(collectionName, collectionKey),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    act(() => {
      result.current.set("changed from hook");
    });

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBe("changed from hook");
  });

  it("removes value", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStorage(collectionName, collectionKey),
      {
        wrapper,
        initialProps: { miro },
      },
    );

    act(() => {
      result.current.remove();
    });

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();
  });
});
