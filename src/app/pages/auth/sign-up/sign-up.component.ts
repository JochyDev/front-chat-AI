import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
private _formBuilder = inject(FormBuilder);
private _authService = inject(AuthService);
private _router = inject(Router);

signUpForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.signUpForm = this._formBuilder.group({
      name: ['', [
              Validators.required,
              Validators.maxLength(50),
          ],
      ],
      password: ['',  [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['',  [
        Validators.required,
      ]],
      },
      {
        validators: this.matchPasswords,
      }
    ); 
  }

  matchPasswords(control: AbstractControl){
    const password = control?.get('password')?.value
    const confirmPassword = control?.get('confirmPassword')?.value

    if(confirmPassword !== password){
      return { match_password: true}
    }

    return null
  }

  onRegister(){
    const {name, password} = this.signUpForm.value;
    this._authService.signUp({name, password}).subscribe({
      next: (response) => {
        this._router.navigateByUrl('/auth/sign-in');
      }
    })
  }
}
