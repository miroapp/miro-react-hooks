import { useCallback, useEffect, useMemo, useState } from "react";
import {
  OnlineUserInfo,
  Session,
  SessionStartProps,
  SessionsLifecycleEvent,
  UserSessionEvent,
} from "@mirohq/websdk-types";

import { useMiro } from "../useMiro";
import { useOnlineUsers } from "../useOnlineUsers";

type SessionState = "idle" | "started" | "ended";

/**
 * Interacts with Miro session
 */
export const useSession = () => {
  const [status, setStatus] = useState<SessionState>("idle");
  const [session, setSession] = useState<Session>();
  const [usersInSession, setUsersInSession] = useState<OnlineUserInfo[]>([]);
  const onlineUsers = useOnlineUsers();
  const miro = useMiro();

  const start = useCallback(
    async (opts: SessionStartProps) => {
      const session = await miro.board.collaboration.startSession(opts);
      setSession(session);
      setStatus("started");
      return session;
    },
    [miro.board.collaboration],
  );

  useEffect(() => {
    if (!session) {
      return;
    }

    const onUserJoined = async (event: UserSessionEvent) => {
      if (onlineUsers.status !== "success") {
        return;
      }

      const { userId } = event;
      const user = onlineUsers.result.find((user) => user.id === userId);

      if (user) {
        setUsersInSession((usersInSession) => [...usersInSession, user]);
      }
    };

    const onUserLeft = async (event: UserSessionEvent) => {
      const { userId } = event;
      setUsersInSession((usersInSession) => usersInSession.filter((user) => user.id !== userId));
    };

    session.on("user-joined", onUserJoined);
    session.on("user-left", onUserLeft);

    return () => {
      session.off("user-joined", onUserJoined);
      session.off("user-left", onUserLeft);
    };
  }, [session, onlineUsers.status, onlineUsers.result]);

  useEffect(() => {
    const setSessionEnded = (sessionEvent: SessionsLifecycleEvent) => {
      if (sessionEvent.session.id === session?.id) {
        setStatus("ended");
      }
    };

    miro.board.collaboration.on("sessions:ended", setSessionEnded);

    return () => {
      miro.board.collaboration.off("sessions:ended", setSessionEnded);
    };
  }, [miro.board.collaboration, session]);

  const usersNotInSession = useMemo(() => {
    if (onlineUsers.status !== "success") {
      return [];
    }

    return onlineUsers.result.filter((user) =>
      usersInSession.every((userInSession) => user.id !== userInSession.id),
    );
  }, [onlineUsers.status, onlineUsers.result, usersInSession]);

  return {
    status,
    session,
    start,
    usersInSession,
    usersNotInSession,
  };
};
