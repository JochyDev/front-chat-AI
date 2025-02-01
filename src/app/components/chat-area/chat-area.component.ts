import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-chat-area',
  imports: [
    MatDividerModule, 
    MatFormFieldModule, 
    MatIconModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    DatePipe, 
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
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

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(){
    this._chatService.selectedChat$.subscribe((id: string) => {
      if(id){
        this._chatService.getChat(id).subscribe(response => {
          this.selectedChat = response
          this.membersLabel = response.members.map(member => member.name).join(', ')
          setTimeout(() => {
            this.endOfChat.nativeElement.scrollIntoView({behavior: 'auto'});
          }, 20)
        })
      }
    })

    this._socketIoService.listen('on-message').subscribe((message: any) => {
      this.isLoading.update(val => false);
      if(this.selectedChat?._id === message.chat){
        this.selectedChat.messages.push(message);
      }
      if(this.endOfChat){
        setTimeout(() => {
          this.endOfChat.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 200)
      }
    })

    this._socketIoService.listen('on-error').subscribe(({response}) => {
      this.errorMessage.set(response.message)
      this.isLoading.update(val => false)
      setTimeout(() => {
        this.endOfChat.nativeElement.scrollIntoView({behavior: 'smooth'});
      }, 200)
      setTimeout(() => {
        this.errorMessage.update(val => '')
      }, 4000)
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
    this.isLoading.update(val => true);
    this.messageControl.reset();
  }

}
