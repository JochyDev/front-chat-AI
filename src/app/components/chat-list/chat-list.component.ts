import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user.interface';
import { Chat } from '../../core/interfaces/chat.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateChatDialogComponent } from '../create-chat-dialog/create-chat-dialog.component';
import { DatePipe } from '@angular/common';
import { SocketIoService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-chat-list',
  imports: [MatDividerModule, MatButtonModule, MatIconModule, MatListModule, ReactiveFormsModule, DatePipe],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {

  private _chatService = inject(ChatService);
  private _authService = inject(AuthService);
  private _socketIoService = inject(SocketIoService);
  readonly dialog = inject(MatDialog);


  chats: Chat[] = [];
  userLogged!: User;

  chatListControl = new FormControl('');
  selectedChatId!: string;

  ngOnInit(): void {
    this.userLogged = this._authService.user;
    this.getUserChats(this.userLogged.id);
    
    this._socketIoService.listen('on-create-chat').subscribe({
      next: (response) => {
        this.chats.push(response)
      } 
    })

    this._socketIoService.listen('on-message').subscribe({
      next: (response) => {
        this.chats = this.chats.map( chat => {
          if(chat._id === response.chat ){
            chat.lastMessage = response
          }
          return chat
        })
      } 
    })
  }

  openDialog(){
    this.dialog.open(CreateChatDialogComponent, {
      width: '450px'
    })
  }

  onSelectChat(id: string){
    this.selectedChatId = id;
    this._chatService.selectedChat(id);
  }

  getUserChats(id: string){
    this._chatService.getUserChats(id).subscribe({
      next: (response) => {
        this.chats = response.map(chat => {
          let lastMessage = chat.messages[0];

          chat.messages.forEach( message => {
            if(message.createdAt > lastMessage.createdAt){
              lastMessage = message
            }
          })

          return {...chat, lastMessage}
        });
      }
    })
  }

}
