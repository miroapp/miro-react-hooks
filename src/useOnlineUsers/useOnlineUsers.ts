import { OnlineUserInfo } from "@mirohq/websdk-types";
import { useState, useEffect } from "react";

import { useMiro } from "../useMiro/useMiro";

export const useOnlineUsers = () => {
  const miro = useMiro();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInfo[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const users = await miro.board.getOnlineUsers();
      setOnlineUsers(users);
    };

    miro.board.ui.on("online_users:update", fetch);

    fetch();

    return () => {
      miro.board.ui.off("online_users:update", fetch);
    };
  }, []);

  return onlineUsers;
};
