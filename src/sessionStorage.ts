import { sessionObj } from "./utils/types";

abstract class SessionStore {
    abstract findSession(sessionID: string): sessionObj | undefined;
    abstract saveSession(sessionID: string, session: sessionObj): void;
    abstract findAllSessions(): sessionObj[];
}

export class InMemorySessionStore extends SessionStore {
    sessions: Map<string, sessionObj>;
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(sessionID: string) {
        return this.sessions.get(sessionID);
    }

    saveSession(sessionID: string, session: sessionObj) {
        this.sessions.set(sessionID, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

