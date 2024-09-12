import { Server as SocketIOServer } from 'socket.io';
import { getUserByUserName } from "../apiService";
import { setGameProperties } from "../setGamePropties";
import { GameProperties } from "../utils/types";

export const handleUpdatingGameProperties = async (socketIO:SocketIOServer, gameProperties: GameProperties | 'none', userName?: string) => {
    if(gameProperties !== 'none'){
        const updatedGameProperties = await setGameProperties(gameProperties)
        socketIO.in((updatedGameProperties.chatRoom as string).toString()).emit('updateGamePropertiesResponse', updatedGameProperties);
    }
    else if(userName){ // when a browser is refreshed
        const user = (await getUserByUserName(userName))
        const currentChatRoom = user.chatRoom
        const updatedGameProperties = await setGameProperties({chatRoom: currentChatRoom})
        socketIO.in(currentChatRoom.toString()).emit('updateGamePropertiesResponse', updatedGameProperties);
    }
}