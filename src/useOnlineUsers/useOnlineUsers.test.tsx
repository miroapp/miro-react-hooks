import { renderHook } from "@testing-library/react-hooks";

import { useOnlineUsers } from "./useOnlineUsers";
import { buildUser, wrapper, dispatchEvent, miro, events } from "../tests";

describe("useOnlineUsers", () => {
  afterEach(() => events.clear());

  const users = Array.from({ length: 10 }).map((_, id) =>
    buildUser({
      id: id.toString(),
      name: `User ${id}`,
    }),
  );

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useOnlineUsers());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current online users", async () => {
    jest.spyOn(miro.board, "getOnlineUsers").mockImplementation(() => Promise.resolve(users));

    const { result, waitForNextUpdate } = renderHook(() => useOnlineUsers(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(users);

    expect(miro.board.getOnlineUsers).toHaveBeenCalled();
  });

  it("reacts to newly online users", async () => {
    const spyOnlineUsers = jest.spyOn(miro.board, "getOnlineUsers");
    const { result, waitForNextUpdate } = renderHook(() => useOnlineUsers(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.result).toMatchObject([]);

    const fns = events.get("online_users:update");

    expect(fns).toHaveLength(1);

    spyOnlineUsers.mockImplementationOnce(() => Promise.resolve(users));
    dispatchEvent("online_users:update");

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject([]);

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(users);
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
