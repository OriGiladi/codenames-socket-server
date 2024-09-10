import { Server as SocketIOServer } from 'socket.io';
import { user } from "../utils/types";
import { getChosenParts, getUsersByChatRoomID } from "../apiService";

export const handleChoosingPart = async (socketIO: SocketIOServer, chatRoomID: number) => {
    const users = (await getUsersByChatRoomID(chatRoomID)) as user  []
    
    socketIO.emit('updatingUsersResponse', users);
    socketIO.emit('partsResponse', getChosenParts(await getUsersByChatRoomID(chatRoomID))); // to see the avilable parts in the waiting room (after a user enters the game)
}