import { EventTypeUnprefixed, Miro } from "@mirohq/websdk-types";
import { MockOptions, PartialFuncReturn, createMock } from "@golevelup/ts-jest";
import { merge } from "lodash";

import { EventManager } from "./EventManager";
import { MiroStorage } from "./MiroStorage";
import { MiroViewport } from "./MiroViewport";

export const dispatchEvent = <T>(event: EventTypeUnprefixed, payload?: T) => {
  events.dispatch(event, payload);
};

export const events = new EventManager<EventTypeUnprefixed>();
export const storage = new MiroStorage();
export const viewport = new MiroViewport();

export const buildMiro = (partial?: PartialFuncReturn<Miro>, options?: MockOptions): Miro =>
  createMock<Miro>(
    merge(
      {
        board: {
          ui: {
            on: events.on.bind(events),
            off: events.off.bind(events),
          },
          getOnlineUsers: jest.fn(() => Promise.resolve([])),
          getInfo: jest.fn(),
          viewport,
          storage,
        },
      },
      partial ?? {},
    ),
    options,
  );

export const miro = buildMiro();
