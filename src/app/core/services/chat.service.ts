import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  private selectedChatSubject = new BehaviorSubject<string>('')
  public selectedChat$: Observable<string> = this.selectedChatSubject.asObservable();

  constructor() { }


  getUserChats(userId: string): Observable<Chat[]>{
    return this.http.get<Chat[]>(`${this.apiUrl}/chat/user/${userId}`);
  }

  createChat(body: {name: string, members: string[]}){
    return this.http.post(`${this.apiUrl}/chat`, body);
  }

  selectedChat(value: string){
    this.selectedChatSubject.next(value)
  }

  getChat(id: string): Observable<Chat>{
    return this.http.get<Chat>(`${this.apiUrl}/chat/${id}`);
  }

  sendMessage(body: {sender: string, chat: string, content: string}){
    return this.http.post<Message>(`${this.apiUrl}/message`, body)
  }
}
