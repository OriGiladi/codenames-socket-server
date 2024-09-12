import { Server as SocketIOServer } from 'socket.io';
import { user } from "../utils/types";
import { getChosenParts, getUsersByChatRoom } from "../apiService";

export const handleChoosingPart = async (socketIO: SocketIOServer, chatRoom: string) => {
    const users = (await getUsersByChatRoom(chatRoom)) as user  []
    
    socketIO.in(chatRoom.toString()).emit('updatingUsersResponse', users);
    socketIO.in(chatRoom.toString()).emit('partsResponse', getChosenParts(await getUsersByChatRoom(chatRoom))); // to see the avilable parts in the waiting room (after a user enters the game)
}