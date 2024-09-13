import { user } from './utils/types';
import { REST_API_BASE_URL } from './utils/constants';

export async function getUsersByChatRoom(chatRoom: string){
    const fetchedUsersJson = await fetch(`${REST_API_BASE_URL}/user/chatRoom/${chatRoom}`)
    const fetchedUsers: user []  = (await fetchedUsersJson.json()) as user [] 
    return fetchedUsers
}
export async function getUserByUserName(userName: string){
    const fetchedUserJson = await fetch(`${REST_API_BASE_URL}/user/userName/${userName}`)
    const fetchedUser: {user: user}   = (await fetchedUserJson.json()) as {user: user} 
    return fetchedUser.user
}



export function checkIfAllUsersAreOffline(users: user []){
    for(const user of users){
        if(user.isOnline)
            return false
    }
    return true
}