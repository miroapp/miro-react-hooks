import { renderHook } from "@testing-library/react-hooks";

import { useMiro } from "./useMiro";
import { miro, wrapper } from "../tests";

describe("useMiro", () => {
  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useMiro());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns Miro SDK from context", () => {
    const { result } = renderHook(() => useMiro(), { wrapper, initialProps: { miro } });

    expect(result.current.board).toBeDefined();
    expect(result.current).toMatchObject(miro);
  });
});
