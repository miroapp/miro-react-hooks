import { act, renderHook } from "@testing-library/react-hooks";
import { Session } from "@mirohq/websdk-types";

import { wrapper, miro, buildUsers, setOnlineUsers, getCurrentUser } from "../test-utils";

import { useSession } from "./useSession";

describe("useSession", () => {
  const users = buildUsers(10);

  beforeEach(() => {
    setOnlineUsers(users);
  });

  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => useSession());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it("returns default state", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper,
      initialProps: { miro },
    });

    await waitForNextUpdate();

    const onlineUsers = await miro.board.getOnlineUsers();

    expect(result.current.status).toBe("idle");
    expect(result.current.session).toBeUndefined();
    expect(result.current.usersInSession).toEqual([]);
    expect(result.current.usersNotInSession).toEqual(onlineUsers);
  });

  it("creates session", async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper,
      initialProps: { miro },
    });

    let session: Session;

    await act(async () => {
      session = await result.current.start({
        name: "Test session",
        color: "#ff0000",
        description: "My test session",
      });
    });

    const onlineUsers = await miro.board.getOnlineUsers();

    expect(result.current.status).toBe("started");
    // @ts-expect-error assigning in above act
    expect(result.current.session).toMatchObject(session);

    expect(result.current.usersInSession).toEqual([]);
    expect(result.current.usersNotInSession).toEqual(onlineUsers);
  });

  it("joins current user", async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper,
      initialProps: { miro },
    });

    await act(async () => {
      result.current.start({
        name: "Test session",
        color: "#ff0000",
        description: "My test session",
      });
    });

    expect(result.current.session).toBeDefined();

    await result.current.session!.join();

    const currentUser = getCurrentUser();
    const onlineUsers = await miro.board.getOnlineUsers();
    const notInSession = onlineUsers.filter((user) => user.id !== currentUser.id);

    expect(result.current.usersInSession).toEqual([currentUser]);
    expect(result.current.usersNotInSession).toEqual(notInSession);
  });

  it("invites user", async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper,
      initialProps: { miro },
    });

    await act(async () => {
      result.current.start({
        name: "Test session",
        color: "#ff0000",
        description: "My test session",
      });
    });

    expect(result.current.session).toBeDefined();

    const onlineUsers = await miro.board.getOnlineUsers();
    const theUser = onlineUsers.pop()!;

    // our tests already joins users on invitation,
    // we don't need to check invitation logic here
    await result.current.session!.invite(theUser);

    expect(result.current.usersInSession).toEqual([theUser]);
    expect(result.current.usersNotInSession).toEqual(onlineUsers);
  });
});
