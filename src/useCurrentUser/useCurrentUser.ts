import { UserInfo } from "@mirohq/websdk-types";
import { useState, useEffect } from "react";
import { useMiro } from "../useMiro/useMiro";

export const useCurrentUser = (): UserInfo => {
  const miro = useMiro();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    const fetch = async () => {
      const info = await miro.board.getUserInfo();
      setUserInfo(info);
    };

    fetch();
  }, [miro.board]);

  return userInfo;
};
