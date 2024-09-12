import { Server as SocketIOServer } from 'socket.io';
import { GameProperties } from "../utils/types";
import { REST_API_BASE_URL } from "../utils/constants";
import { getHeaders } from "../utils/sdk";
import axios from "axios";
import { setGameProperties } from "../setGamePropties";

export const handleStartingGame = async (socketIO: SocketIOServer, gameStartProperties: GameProperties) => {  
    const gamesCreatedJson = await fetch(`${REST_API_BASE_URL}/gameProperties/${gameStartProperties.chatRoom}`);
    const gamesCreated = await gamesCreatedJson.json() as GameProperties [];
    if (gamesCreated.length === 0){
        try {
            await axios.post(`${REST_API_BASE_URL}/gameProperties`, gameStartProperties, {
                headers: getHeaders()
            });
            const gameProperties = await setGameProperties(gameStartProperties)
            socketIO.in((gameStartProperties.chatRoom as string).toString()).emit('updateGamePropertiesResponse', gameProperties);
        } catch (error) {
            console.error(error);
            return { response: false, data: null };
        }  
    }
}