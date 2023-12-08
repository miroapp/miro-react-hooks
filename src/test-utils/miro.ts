import { EventTypeUnprefixed, Miro, OnlineUserInfo, UserInfo } from "@mirohq/websdk-types";
import { MockOptions, PartialFuncReturn, createMock } from "@golevelup/ts-jest";
import { merge } from "lodash";

import { EventManager } from "./EventManager";
import { MiroStorage } from "./MiroStorage";
import { MiroViewport } from "./MiroViewport";
import { MiroCollaboration } from "./MiroCollaboration";
import { buildInfo } from "./data";

export const events = new EventManager<EventTypeUnprefixed>();
export const storage = new MiroStorage();
export const viewport = new MiroViewport();
export const collaboration = new MiroCollaboration();
export let currentUser: UserInfo = {
  id: "CURRENT_USER",
  name: "Current user",
};
export const onlineUsers = new Map<string, OnlineUserInfo>();
export let boardInfo = buildInfo();

export const getCurrentUser = () => currentUser;

export const dispatchEvent = <T>(event: EventTypeUnprefixed, payload?: T) => {
  events.dispatch(event, payload);
};

export const setOnlineUsers = (users: OnlineUserInfo[]) => {
  users.forEach((user) => onlineUsers.set(user.id, user));
  dispatchEvent("online_users:update");
};

export const addOnlineUsers = (...users: OnlineUserInfo[] | OnlineUserInfo[][]) => {
  users.forEach((user) => onlineUsers.set(user.id, user));
  dispatchEvent("online_users:update");
};

export const clearOnlineUsers = () => {
  onlineUsers.clear();
  onlineUsers.set(currentUser.id, currentUser);
};

export const setCurrentUser = (user: UserInfo) => {
  currentUser = user;
};

clearOnlineUsers();

export const buildMiro = (partial?: PartialFuncReturn<Miro>, options?: MockOptions): Miro =>
  createMock<Miro>(
    merge(
      {
        board: {
          ui: {
            on: events.on.bind(events),
            off: events.off.bind(events),
          },
          getOnlineUsers: jest.fn(async () => [...onlineUsers.values()]),
          getUserInfo: jest.fn(async () => currentUser),
          getInfo: jest.fn(async () => boardInfo),
          viewport,
          storage,
          collaboration,
        },
      },
      partial ?? {},
    ),
    options,
  );

export const miro = buildMiro();
