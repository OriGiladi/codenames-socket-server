import axios from "axios";
import { REST_API_BASE_URL } from "./utils/constants";
import { GameProperties, GamePropertiesKey } from "./utils/types";

export const setGameProperties = async (updatedProperties: GameProperties) => {
    const gamePropertiesJson = await fetch(`${REST_API_BASE_URL}/gameProperties/${updatedProperties.chatRoomID}`);
    const gameProperties = await gamePropertiesJson.json() as GameProperties [];
    if(gameProperties.length === 0){
        console.error('no game properties has been found for chatRoomID:',updatedProperties.chatRoomID)
    }
    const updatedGameProperties: GameProperties = { ...gameProperties[0] };
    for (const [key, value] of Object.entries(updatedProperties)) {
        (updatedGameProperties[key as GamePropertiesKey] as GameProperties)= value as GameProperties; 
    }
    try{
        axios.patch(`${REST_API_BASE_URL}/gameProperties`, updatedGameProperties)
    }
    catch(error){
        console.error(error);
    }
    return updatedGameProperties
}