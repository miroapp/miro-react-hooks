import { renderHook } from "@testing-library/react-hooks";

import { useInfo } from "./useInfo";
import { wrapper, miro } from "../test-utils";

describe("useInfo", () => {
  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useInfo());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns current info", async () => {
    const info = await miro.board.getInfo();

    const { result, waitForNextUpdate } = renderHook(() => useInfo(), {
      wrapper,
      initialProps: { miro },
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toMatchObject(info);
  });

  it("handles error", async () => {
    const error = new Error("Something wrong");
    jest.spyOn(miro.board, "getInfo").mockImplementation(() => Promise.reject(error));

    const { result, waitForNextUpdate } = renderHook(() => useInfo(), {
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
