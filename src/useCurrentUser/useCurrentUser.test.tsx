import { renderHook } from "@testing-library/react-hooks";

import { useCurrentUser } from "./useCurrentUser";
import { buildMiro, buildUser, wrapper } from "../test-utils";

describe("useCurrentUser", () => {
  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useCurrentUser());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current user", async () => {
    const user = buildUser();
    const miro = buildMiro({
      board: {
        getUserInfo: jest.fn(() => Promise.resolve(user)),
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCurrentUser(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(user);

    expect(miro.board.getUserInfo).toHaveBeenCalled();
  });

  it("handles error", async () => {
    const error = new Error("Something wrong");
    const miro = buildMiro({
      board: {
        getUserInfo: jest.fn(() => Promise.reject(error)),
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCurrentUser(), {
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
});
