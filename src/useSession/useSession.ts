import { useCallback, useEffect, useMemo, useState } from "react";
import {
  OnlineUserInfo,
  Session,
  SessionStartProps,
  SessionsLifecycleEvent,
} from "@mirohq/websdk-types";

import { useMiro } from "../useMiro/useMiro";
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

  const fetchUsersInSessions = useCallback(async () => {
    if (!session || onlineUsers.status !== "success") {
      setUsersInSession([]);
      return;
    }

    const usersId = await session.getUsers();
    const usersInSession = onlineUsers.result.filter((user) => usersId.includes(user.id));
    setUsersInSession(usersInSession);
    return;
  }, [session, onlineUsers.status, onlineUsers.result]);

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
    fetchUsersInSessions();
  }, [fetchUsersInSessions]);

  useEffect(() => {
    if (!session) {
      return;
    }

    session.on("user-joined", fetchUsersInSessions);
    session.on("user-left", fetchUsersInSessions);

    return () => {
      session.off("user-joined", fetchUsersInSessions);
      session.off("user-left", fetchUsersInSessions);
    };
  }, [session, fetchUsersInSessions]);

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

  console.log({ status, session, usersInSession, usersNotInSession });

  return {
    status,
    session,
    start,
    usersInSession,
    usersNotInSession,
  };
};
