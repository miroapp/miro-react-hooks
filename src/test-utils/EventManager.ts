type Handler<Args = any> = (...args: Args[]) => unknown;

export class EventManager<Event extends string = string> {
  private handlers = new Map<Event, Handler[]>();

  on(event: Event, handler: Handler) {
    const fns = this.handlers.get(event) ?? [];
    this.handlers.set(event, [...fns, handler]);
  }

  off(event: Event, handler: Handler) {
    const fns = this.handlers.get(event) ?? [];
    this.handlers.set(
      event,
      fns.filter((h) => h !== handler),
    );
  }

  dispatch<Payload = unknown>(event: Event, payload: Payload) {
    const fns = this.handlers.get(event) ?? [];
    fns.forEach((fn) => fn(payload));
  }

  clear() {
    this.handlers.clear();
  }
}
