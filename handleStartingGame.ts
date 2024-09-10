import { Socket } from "socket.io";
import { GameProperties } from "../utils/types";
import { REST_API_BASE_URL } from "../utils/constants";
import { getHeaders } from "../utils/sdk";
import axios from "axios";
import { setGameProperties } from "../setGamePropties";

export const handleStartingGame = async (socketIO: Socket, gameStartProperties: GameProperties) => {  
    const gamesCreatedJson = await fetch(`${REST_API_BASE_URL}/gameProperties/${gameStartProperties.chatRoomID}`);
    const gamesCreated = await gamesCreatedJson.json() as GameProperties [];
    if (gamesCreated.length === 0){
        try {
            await axios.post(`${REST_API_BASE_URL}/gameProperties`, gameStartProperties, {
                headers: getHeaders()
            });
            const gameProperties = await setGameProperties(gameStartProperties)
            socketIO.emit('updateGamePropertiesResponse', gameProperties);
        } catch (error) {
            console.error(error);
            return { response: false, data: null };
        }  
    }
}