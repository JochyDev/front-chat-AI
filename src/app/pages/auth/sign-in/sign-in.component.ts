import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  private _formBuilder = inject(FormBuilder)
  private _authService = inject(AuthService)
  private _router = inject(Router)

  signInForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      name: ['', [
              Validators.required,
              Validators.maxLength(50),
          ],
      ],
      password: ['', Validators.required],
    });
  }

  SingIn(){
    if(this.signInForm.invalid)return;
    
    this._authService.signIn(this.signInForm.value).subscribe({
      next: (response) => {
        this._router.navigateByUrl('/chat')
      }
    })
  }

}
