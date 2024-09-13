import crypto from 'crypto'
import { Parts, user } from './types';

export const randomId = () => crypto.randomBytes(8).toString("hex");

export function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    }
    return headers
}

export function getChosenParts(users: user []): Parts { //TODO: find a better place for this
    const chosenParts = {
        blueCM: false,
        blueP: false,
        redCM: false,
        redP: false
    }
    users.forEach((user) => {
        if(user.role === 'code-master'&& user.team ===  "blue")
            chosenParts.blueCM = true
        if(user.role === 'player' && user.team === "blue")
            chosenParts.blueP = true
        if(user.role === 'code-master' && user.team === "red")
            chosenParts.redCM = true
        if(user.role === 'player' && user.team === "red")
            chosenParts.redP = true
    })
    return chosenParts
}