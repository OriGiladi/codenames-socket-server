import express from "express";
import cors from "cors";
import { GameProperties, SessionSocket, user } from "./utils/types";
const app = express();
app.use(express.json());
app.use(cors());
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
const http = createServer(app);
import { InMemorySessionStore } from "./sessionStorage";
import { handlesSession } from "./middlewares/handleSession";
import { handleDisconnection } from "./handlers/handleDiconnection";
import { handleChoosingPart } from "./handlers/handleChoosingPart";
import { handleNewUser } from "./handlers/handleNewUser";
import { handleStartingGame } from "./handlers/handleStartingGame";
import { handleUpdatingGameProperties } from "./handlers/handleUpdatingGameProperties";

const socketIO = new SocketIOServer(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

const sessionStore = new InMemorySessionStore();
socketIO.use(handlesSession(sessionStore)); 

socketIO.on('connection', (socket: SessionSocket) => {
    console.log(`⚡: ${socket.id} user just connected!`);   
    sessionStore.saveSession(socket.sessionID as string, {
        userID: socket.userID as string,
        userName: socket.userName as string,
        connected: true,
    });
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    socket.on('disconnect', () => {
        handleDisconnection(socket, socketIO)
    });
    socket.on('getChosenParts', (chatRoomID: number) => {
        handleChoosingPart( socketIO, chatRoomID)
    });
    socket.on('newUser', (user: user, chatRoomID: number | undefined) => {
        handleNewUser( socketIO ,socket, user, chatRoomID)
    });
    socket.on('gameStart',(gameStartProperties: GameProperties) => {
        handleStartingGame(socketIO, gameStartProperties)}
    );
    socket.on('updateGameProperties',(gameProperties: GameProperties | 'none', userName?: string) => {
        handleUpdatingGameProperties(socketIO, gameProperties, userName)
    });
    socket.on("join_room", (chatRoomID: string) => {
        socket.join(chatRoomID.toString());
    });
});

http.listen(3002, () => {
    console.log("socket is running on port 3002")
})