import axios from "axios";
import {  getUserByUserName, getUsersByChatRoom } from "../apiService";
import { REST_API_BASE_URL } from "../utils/constants";
import {user} from "../utils/types";
import { getChosenParts, getHeaders } from "../utils/sdk";
import { Socket, Server as SocketIOServer} from 'socket.io';

export const handleNewUser =  async (socketIO: SocketIOServer, socket: Socket, user: user, chatRoom: string | undefined) => {
    if(chatRoom === '' || chatRoom === undefined){ // the game is refrehed
        const fetchedUser = (await getUserByUserName(user.userName))
        chatRoom = fetchedUser.chatRoom
    }
    if(chatRoom){
        socket.join(chatRoom);
        const onlineUserProperties = {
            isOnline: true,
            userName: user.userName as string
        }
        await axios.patch(`${REST_API_BASE_URL}/user/online`, onlineUserProperties, {
            headers: getHeaders()
        });
        const users = (await getUsersByChatRoom(chatRoom)) as user  []

        socketIO.in(chatRoom).emit('updatingUsersResponse', users);
        socketIO.in(chatRoom).emit('partsResponse',getChosenParts(users)); // to see the avilable parts in the waiting room (after a user enters the game)
    }
        
}