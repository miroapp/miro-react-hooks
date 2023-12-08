import {
  Attention,
  Collaboration,
  CollaborationEventType,
  Item,
  OneOrMany,
  OnlineUserInfo,
  Session,
  SessionEventType,
  SessionStartProps,
} from "@mirohq/websdk-types";
import { createMock } from "@golevelup/ts-jest";

import { getCurrentUser } from "./miro";
import { EventManager, Handler } from "./EventManager";

type RemovePrefixed<Event> = Event extends `sessions:${infer ThisOne}` ? ThisOne : never;
type SessionEvent = RemovePrefixed<SessionEventType>;

export class MiroSession implements Session {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public color: string,
    public starterId: string,
  ) {}

  private userInvited = new Map<string, OnlineUserInfo>();
  private userJoined = new Map<string, OnlineUserInfo>();
  private events = new EventManager<SessionEvent>();

  async invite(...users: OnlineUserInfo[] | OnlineUserInfo[][]): Promise<void> {
    users.forEach((user) => {
      this.userInvited.set(user.id, user);
      // We don't care about the invitation logic here in the hooks library
      // So users invited are automatically joined
      this.joined(user);
    });
  }

  async join(): Promise<void> {
    const user = getCurrentUser();
    this.joined(user);
  }

  async leave(): Promise<void> {
    const user = getCurrentUser();
    this.left(user);
  }

  async getUsers(): Promise<string[]> {
    return [...this.userJoined.values()].map((user) => user.id);
  }

  async hasJoined(user: string): Promise<boolean> {
    return this.userJoined.has(user);
  }

  async on(name: SessionEvent, handler: Handler): Promise<void> {
    this.events.on(name, handler);
  }

  async off(name: SessionEvent, handler: Handler): Promise<void> {
    this.events.off(name, handler);
  }

  async end(): Promise<void> {
    this.userInvited.clear();
    this.userJoined.clear();
  }

  /**
   * Special control methods for tests
   */
  joined(user: OnlineUserInfo) {
    this.userJoined.set(user.id, user);
    this.events.dispatch("user-joined", {
      id: Date.now(),
      userId: user.id,
      sessionId: this.id,
    });
  }

  left(user: OnlineUserInfo) {
    this.userJoined.delete(user.id);
    this.events.dispatch("user-left", {
      id: Date.now(),
      userId: user.id,
      sessionId: this.id,
    });
  }
}

export class MiroCollaboration implements Collaboration {
  attention: Attention;

  constructor() {
    this.attention = createMock<Attention>();
  }

  private sessions = new Map<string, Session>();
  private events = new EventManager<CollaborationEventType>();

  async startSession(props: SessionStartProps): Promise<Session> {
    const session = new MiroSession(
      Date.now().toString(),
      props.name,
      props.description ?? "",
      props.color ?? "",
      getCurrentUser().id,
    );

    this.sessions.set(session.id, session);

    this.events.dispatch("sessions:started", { session });

    return session;
  }

  async getSessions(): Promise<Session[]> {
    return [...this.sessions.values()];
  }

  async on(name: CollaborationEventType, handler: Handler): Promise<void> {
    this.events.on(name, handler);
  }

  async off(name: CollaborationEventType, handler: Handler): Promise<void> {
    this.events.off(name, handler);
  }

  zoomTo(_: OnlineUserInfo, _1: OneOrMany<Item>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
