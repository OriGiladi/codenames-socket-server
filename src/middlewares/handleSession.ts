import { InMemorySessionStore } from "../sessionStorage";
import { SessionSocket } from "../utils/types";
import { randomId } from "../utils/sdk";
import { ExtendedError } from "socket.io/dist/namespace";

export const handlesSession = (sessionStore: InMemorySessionStore) => {
    return (socket: SessionSocket, next: (err?: ExtendedError | undefined) => void) => {
        const sessionID: string = socket.handshake.auth.sessionID;
        if (sessionID) {
            const session = sessionStore.findSession(sessionID);
            if (session) {
                socket.sessionID = sessionID;
                socket.userID = session.userID;
                socket.userName = session.userName; // undefined for now TODO: fix it
                return next();
            }
        }
        const username = socket.handshake.auth.userName;
        if (!username) {
            return next(new Error("invalid username"));
        }

        socket.sessionID = randomId();
        //socket.userID = randomId();
        socket.userName = username;
        next();
    };
};
