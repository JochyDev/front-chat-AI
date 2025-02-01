import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  apiUrl = environment.apiUrl;

  socket: Socket;
  constructor(
    private authService: AuthService
  ) { 
    this.socket = io(this.apiUrl, {
      extraHeaders: {
        authentication: this.authService.accessToken
      },
      transports: ['websocket']
    })
  }

  listen(eventName: string): Observable<any>{
    return new Observable((subscriber) => {
      this.socket.on(eventName, ( data: any ) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data)
  }

}
