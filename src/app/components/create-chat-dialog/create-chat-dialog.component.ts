import { Component, inject, TemplateRef, ViewChild } from '@angular/core';

import { 
  MatDialogRef, 
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog'
import { MatListModule, MatSelectionList } from '@angular/material/list'
import { User } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ChatService } from '../../core/services/chat.service';
import { SocketIoService } from '../../core/services/socket-io.service';


@Component({
  selector: 'app-create-chat-dialog',
  imports: [
    MatListModule, 
    MatDividerModule, 
    MatDialogActions, 
    MatDialogClose, 
    MatDialogContent, 
    MatDialogTitle, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss'
})
export class CreateChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateChatDialogComponent>);
  private _authService = inject(AuthService);
  private _sockeIoService = inject(SocketIoService)

  @ViewChild('usersList') usersList!: MatSelectionList; 

  users: User[] = []
  userLogged!: User;

  nameControl = new FormControl('', Validators.required)
  

  ngOnInit(): void {
    this.userLogged = this._authService.user;
    this.getAllUsers();
  }

  getAllUsers(){
    this._authService.getAllUser().subscribe({
      next: (response ) => {
        debugger
        this.users = response.filter((user) => user._id !== this.userLogged.id);
      }
    })
  }

  createChat(){
    const usersSelected = this.usersList.selectedOptions.selected.map( selected => selected.value)
    usersSelected.push(this.userLogged.id)

    if(this.nameControl.invalid || usersSelected.length == 0 ) return;

    const name = this.nameControl.value || '';

    const data = {name, members: usersSelected};

    this._sockeIoService.emit('create-chat', data);
  }
}
