import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  socket: Socket;
  constructor(
    private authService: AuthService
  ) { 
    this.socket = io('http://localhost:3000',{
      extraHeaders: {
        authentication: this.authService.accessToken
      }
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
