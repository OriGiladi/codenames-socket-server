import { Parts, user } from './utils/types';
import { REST_API_BASE_URL } from './utils/constants';

export async function getUsersByChatRoomID(chatRoomID: number){
    const fetchedUsersJson = await fetch(`${REST_API_BASE_URL}/user/chatRoomID/${chatRoomID}`)
    const fetchedUsers: user []  = (await fetchedUsersJson.json()) as user [] 
    return fetchedUsers
}
export async function getUserByUserName(userName: string){
    const fetchedUserJson = await fetch(`${REST_API_BASE_URL}/user/userName/${userName}`)
    const fetchedUser: {user: user}   = (await fetchedUserJson.json()) as {user: user} 
    return fetchedUser.user
}

export  function getChosenParts(users: user []): Parts { //TODO: find a better place for this
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

export function checkIfAllUsersAreOffline(users: user []){
    for(const user of users){
        if(user.isOnline)
            return false
    }
    return true
}