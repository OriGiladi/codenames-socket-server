

import { Socket } from "socket.io";
import { SessionSocket, user } from "../utils/types";
import { checkIfAllUsersAreOffline, getUserByUserName, getUsersByChatRoomID } from "../apiService";
import { REST_API_BASE_URL } from "../utils/constants";
import { getHeaders } from "../utils/sdk";
import axios from "axios";

export const handleDisconnection = async (socket: SessionSocket, socketIO: Socket) => {
    console.log('🔥: A user disconnected');
    try {
        const disconnectedUser = (await getUserByUserName(socket.userName as string))
        const currentChatRoomID = disconnectedUser.chatRoomID 
        const onlineUserProperties = {
            isOnline: false,
            userName: socket.userName as string
        }
        await axios.patch(`${REST_API_BASE_URL}/user`, onlineUserProperties, {
            headers: getHeaders()
        });
        const usersInRoom = (await getUsersByChatRoomID(currentChatRoomID)) as user []
        if(checkIfAllUsersAreOffline(usersInRoom))
        {
            await axios.delete(`${REST_API_BASE_URL}/gameProperties/${currentChatRoomID}`, {
                headers: getHeaders()
            });
            await axios.delete(`${REST_API_BASE_URL}/user/room/${currentChatRoomID}`, {
                headers: getHeaders()
            });
        }
        socketIO.emit('updatingUsersResponse', usersInRoom);
    } catch (error) {
        console.error(error);
    }  
}