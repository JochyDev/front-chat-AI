import { Component } from '@angular/core';
import { ChatAreaComponent } from "../../components/chat-area/chat-area.component";
import { ChatListComponent } from '../../components/chat-list/chat-list.component';

@Component({
  selector: 'app-main-chat',
  imports: [ChatAreaComponent, ChatListComponent],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent {

}
