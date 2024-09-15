import { Server as SocketIOServer } from 'socket.io';
import { getUserByUserName } from "../apiService";
import { setGameProperties } from "../setGamePropties";
import { GameProperties } from "../utils/types";
import { REST_API_BASE_URL } from '../utils/constants';

export const handleUpdatingGameProperties = async (socketIO:SocketIOServer, gameProperties: GameProperties | 'none', userName?: string) => {
    if(gameProperties !== 'none'){
        const updatedGameProperties = await setGameProperties(gameProperties)
        socketIO.in((updatedGameProperties.chatRoom as string)).emit('updateGamePropertiesResponse', updatedGameProperties);
    }
    else if(userName){ // when a browser is refreshed
        const user = (await getUserByUserName(userName))
        const currentChatRoom = user.chatRoom
        const gamePropertiesJson = await fetch(`${REST_API_BASE_URL}/gameProperties/${currentChatRoom}`);
        const gameProperties = await gamePropertiesJson.json() as GameProperties [];
        const updatedGameProperties: GameProperties = { ...gameProperties[0] };
        socketIO.in(currentChatRoom).emit('updateGamePropertiesResponse', updatedGameProperties);
    }
}