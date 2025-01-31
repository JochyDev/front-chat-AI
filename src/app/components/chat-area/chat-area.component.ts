import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../core/services/chat.service';
import { Chat } from '../../core/interfaces/chat.interface';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user.interface';
import { SocketIoService } from '../../core/services/socket-io.service';
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-chat-area',
  imports: [MatDividerModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatInputModule, DatePipe, MatCardModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent {

  private _chatService = inject(ChatService);
  private _authService = inject(AuthService);
  private _socketIoService = inject(SocketIoService);
  @ViewChild('endOfChat') endOfChat!: ElementRef;


  messageControl = new FormControl('')

  selectedChat!: Chat;
  userLogged!: User;
  membersLabel: string = '';

  constructor(){
    this._chatService.selectedChat$.subscribe((id: string) => {
      if(id){
        this._chatService.getChat(id).subscribe(response => {
          this.selectedChat = response
          this.membersLabel = response.members.map(member => member.name).join(', ')
        })
      }
    })

    this._socketIoService.listen('on-message').subscribe((message: any) => {
      this.selectedChat.messages.push(message);
      if(this.endOfChat){
        setTimeout(() => {
          this.endOfChat.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 200)
      }
    })
  }

  ngOnInit(): void {
    this.userLogged = this._authService.user;
  }

  sendMessage(){

    if(this.messageControl.value?.trim().length === 0) return;

    const data = {
      content: this.messageControl.value || '',
      sender: this.userLogged.id,
      chat: this.selectedChat._id
    }

    const eventName = this.messageControl.value?.startsWith('/query') ? 'on-query': 'send-message'

    this._socketIoService.emit(eventName, data);
    this.messageControl.reset();
  }

}
