import axios from "axios";
import { getChosenParts, getUserByUserName, getUsersByChatRoomID } from "../apiService";
import { REST_API_BASE_URL } from "../utils/constants";
import {user} from "../utils/types";
import { getHeaders } from "../utils/sdk";
import { Socket, Server as SocketIOServer} from 'socket.io';

export const handleNewUser =  async (socketIO: SocketIOServer, socket: Socket, user: user, chatRoomID: number | undefined) => {
    if(chatRoomID === 0 || chatRoomID === undefined){ // the game is refrehed
        const us = (await getUserByUserName(user.userName))
        chatRoomID = us.chatRoomID 
    }
    socket.join(chatRoomID.toString());

    const onlineUserProperties = {
        isOnline: true,
        userName: user.userName
    }
    await axios.patch(`${REST_API_BASE_URL}/user`, onlineUserProperties, {
        headers: getHeaders()
    });
    const users = (await getUsersByChatRoomID(chatRoomID)) as user  []

    socketIO.in(chatRoomID.toString()).emit('updatingUsersResponse', users);
    socketIO.in(chatRoomID.toString()).emit('partsResponse', getChosenParts(await getUsersByChatRoomID(chatRoomID))); // to see the avilable parts in the waiting room (after a user enters the game)
}