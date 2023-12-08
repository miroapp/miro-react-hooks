import { act, renderHook } from "@testing-library/react-hooks";

import { useOnlineUsers } from "./useOnlineUsers";
import { wrapper, miro, events, setOnlineUsers, clearOnlineUsers, buildUsers } from "../test-utils";

describe("useOnlineUsers", () => {
  afterEach(() => events.clear());

  const users = buildUsers(10);

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useOnlineUsers());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current online users", async () => {
    setOnlineUsers(users);

    const { result, waitForNextUpdate } = renderHook(() => useOnlineUsers(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    const onlineUsers = await miro.board.getOnlineUsers();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(onlineUsers);
  });

  it("reacts to newly online users", async () => {
    clearOnlineUsers();
    const { result, waitForNextUpdate } = renderHook(() => useOnlineUsers(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.result).toMatchObject([]);

    act(() => {
      setOnlineUsers(users);
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    const onlineUsers = await miro.board.getOnlineUsers();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(onlineUsers);
  });

  it("handles error", async () => {
    const error = new Error("Something wrong");
    jest.spyOn(miro.board, "getOnlineUsers").mockImplementation(() => Promise.reject(error));

    const { result, waitForNextUpdate } = renderHook(() => useOnlineUsers(), {
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
