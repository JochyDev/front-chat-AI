import { User } from "./user.interface";


export interface Message {
    _id: string;
    sender?: User;
    createdAt: string;
    content: string;
    isAiResponse: boolean;
}