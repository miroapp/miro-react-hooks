import { Storage } from "@mirohq/websdk-types";

import { MiroCollection } from "./MiroCollection";

export class MiroStorage implements Storage {
  private data = new Map<string, MiroCollection>();

  collection(name: string) {
    let collection = this.data.get(name);
    if (!collection) {
      collection = new MiroCollection();
    }

    this.data.set(name, collection);
    return collection;
  }

  remove(name: string) {
    this.data.delete(name);
  }

  clear() {
    this.data.clear();
  }
}
