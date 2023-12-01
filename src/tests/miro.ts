import { BoardInfo, EventTypeUnprefixed, Item, Miro, OnlineUserInfo } from "@mirohq/websdk-types";
import { MockOptions, PartialFuncReturn, createMock } from "@golevelup/ts-jest";
import deepmerge from "deepmerge";

type EventHandler = <T>(payload: T) => void;

export const events = new Map<EventTypeUnprefixed, EventHandler[]>();
export const dispatchEvent = <T>(event: EventTypeUnprefixed, payload?: T) => {
  const fns = events.get(event);
  fns?.map((fn) => fn(payload));
};

export const buildMiro = (partial?: PartialFuncReturn<Miro>, options?: MockOptions): Miro =>
  createMock<Miro>(
    deepmerge(
      {
        board: {
          ui: {
            on: (event, cb) => {
              const current = events.get(event) ?? [];
              events.set(event, [...current, cb]);
            },
            off: (event, cb) => {
              const current = events.get(event) ?? [];
              events.set(
                event,
                current.filter((f) => f !== cb),
              );
            },
          },
          getOnlineUsers: jest.fn(() => Promise.resolve([])),
          getInfo: jest.fn(),
        },
      },
      partial ?? {},
    ),
    options,
  );
export const miro = buildMiro();
export const buildUser = (opts?: Partial<OnlineUserInfo>): OnlineUserInfo =>
  deepmerge(
    {
      id: "TEST",
      name: "User Info",
    },
    opts ?? {},
  );
export const buildItem = (opts?: Partial<Item>): Item => {
  const item = createMock<Item>(
    deepmerge(
      {
        id: Date.now().toString(),
      },
      opts ?? {},
    ),
  );

  return item;
};

export const buildInfo = (opts?: Partial<BoardInfo>): BoardInfo =>
  deepmerge(
    {
      id: Date.now().toString(),
      locale: "en",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    opts ?? {},
  );
