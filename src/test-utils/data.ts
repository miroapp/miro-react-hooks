import { createMock } from "@golevelup/ts-jest";
import { BoardInfo, Item, OnlineUserInfo } from "@mirohq/websdk-types";
import { merge } from "lodash";

export const buildUser = (opts: Partial<OnlineUserInfo> = {}): OnlineUserInfo =>
  merge(
    {
      id: "TEST",
      name: "User Info",
    },
    opts,
  );
export const buildItem = (opts: Partial<Item> = {}): Item => {
  const item = createMock<Item>(
    merge(
      {
        id: Date.now().toString(),
      },
      opts,
    ),
  );

  return item;
};

export const buildInfo = (opts: Partial<BoardInfo> = {}): BoardInfo =>
  merge(
    {
      id: Date.now().toString(),
      locale: "en",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    opts,
  );
