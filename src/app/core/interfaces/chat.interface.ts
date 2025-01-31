import { Message } from "./message.interface";
import { User } from "./user.interface";


export interface Chat {
    _id: string;
    members: User[];
    name: string;
    messages: Message[];
    groupUrlProfile?: string;
    lastMessage?: Message;
}