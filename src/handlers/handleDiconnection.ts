import { Server as SocketIOServer } from 'socket.io';
import { SessionSocket, user } from "../utils/types";
import { checkIfAllUsersAreOffline, getUserByUserName, getUsersByChatRoom } from "../apiService";
import { REST_API_BASE_URL } from "../utils/constants";
import { getHeaders } from "../utils/sdk";
import axios from "axios";

export const handleDisconnection = async (socket: SessionSocket, socketIO: SocketIOServer) => {
    console.log('🔥: A user disconnected');
    try {
        const disconnectedUser = (await getUserByUserName(socket.userName as string))
        const currentChatRoom = disconnectedUser.chatRoom 
        
        if(currentChatRoom){
            const onlineUserProperties = {
                isOnline: false,
                userName: socket.userName as string
            }
            await axios.patch(`${REST_API_BASE_URL}/user/online`, onlineUserProperties, {
                headers: getHeaders()
            });
            const usersInRoom = (await getUsersByChatRoom(currentChatRoom)) as user []
            if(checkIfAllUsersAreOffline(usersInRoom))
            {
                await axios.delete(`${REST_API_BASE_URL}/gameProperties/${currentChatRoom}`, {
                    headers: getHeaders()
                });
                await axios.delete(`${REST_API_BASE_URL}/user/room/${currentChatRoom}`, {
                    headers: getHeaders()
                });
            }
            socketIO.in(currentChatRoom).emit('updatingUsersResponse', usersInRoom);
        }
    } catch (error) {
        console.error(error);
    }  
}