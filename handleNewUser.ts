import axios from "axios";
import { getChosenParts, getUserByUserName, getUsersByChatRoomID } from "../apiService";
import { REST_API_BASE_URL } from "../utils/constants";

import {user} from "../utils/types";
import { getHeaders } from "../utils/sdk";
import { Socket } from "socket.io";

export const handleNewUser =  async (socketIO: Socket, user: user, chatRoomID: number | undefined) => {
    if(chatRoomID === 0 || chatRoomID === undefined){ // the game is refrehed
        const us = (await getUserByUserName(user.userName))
        chatRoomID = us.chatRoomID 
    }
    const onlineUserProperties = {
        isOnline: true,
        userName: user.userName
    }
    await axios.patch(`${REST_API_BASE_URL}/user`, onlineUserProperties, {
        headers: getHeaders()
    });
    const users = (await getUsersByChatRoomID(chatRoomID)) as user  []
    
    socketIO.emit('updatingUsersResponse', users);
    socketIO.emit('partsResponse', getChosenParts(await getUsersByChatRoomID(chatRoomID))); // to see the avilable parts in the waiting room (after a user enters the game)
}