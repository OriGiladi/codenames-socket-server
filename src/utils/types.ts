import { Socket } from "socket.io";

export type user = { 
    id: string;
    userName: string;
    chatRoomID: number;
    role: role;
    team: team;
    isOnline: boolean;
}

export type userWithSocket = {
    socketID: string;
    userName: string;
}

export type clueObj = {
    clue: string;
    num: number;
}
export type role = "code-master" | "player"
export type team = "red" | "blue" | "assassin" | "civilian"
export type cardData = {
    word: string;
    team: team;
    clicked: boolean;
}
export type GameProperties = {
    chatRoomID?: number;
    gameArray?: cardData[][];
    firstTeamWords?: string[];
    firstTeamUnguessedWords?: string[];
    secondTeamWords?: string[];
    civilianWords?: string[];
    assassinWord?: string [];
    turn?: team;
    firstTeam?: team;
    secondTeam?: team;
    codeMasterView?: boolean;
    guessesRemaining?: number;
    allDisable?: boolean;
    firstTeamRemainingWords?: number;
    secondTeamRemainingWords?: number;
    firstTeamClues?: clueObj [];
    secondTeamClues?: clueObj [];
    secondTeamUnguessedWords?: string[];
    winner?: 'red' | 'blue' | null;
};

export type message = {
    text: string;
    name: string;
    id: string;
    socketID: string | undefined;
    roomId: number;
}

export type GamePropertiesKey = keyof GameProperties;

export interface SessionSocket extends Socket {
    userID? : string
    userName?: string
    sessionID?: string
}

export type sessionObj = {
    userID: string,
    userName: string,
    connected: boolean,
}

export type Part = 'redP' | 'blueP' | 'redCM' | 'blueCM'
export type Parts = {
    redP: boolean,
    blueP: boolean,
    redCM: boolean,
    blueCM: boolean
}