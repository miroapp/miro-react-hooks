import { Collection, Json } from "@mirohq/websdk-types";

import { EventManager } from "./EventManager";

export type CollectonHandler<T> = (value: T | undefined, version: string) => void;

export class MiroCollection implements Collection {
  private data = new Map<string, unknown>();
  private eventManager = new EventManager<string>();

  async get<T = unknown>(key: string) {
    return this.data.get(key) as T;
  }

  async set<T = unknown>(key: string, value: T) {
    this.data.set(key, value);
    this.eventManager.dispatch(key, value);
  }

  async onValue<T extends Json = Json>(key: string, handler: CollectonHandler<T>) {
    this.eventManager.on(key, handler);
  }

  async offValue<T extends Json = Json>(key: string, handler: CollectonHandler<T>) {
    this.eventManager.off(key, handler);
  }

  async remove(key: string) {
    this.data.delete(key);
    this.eventManager.dispatch(key, undefined);
  }
}
