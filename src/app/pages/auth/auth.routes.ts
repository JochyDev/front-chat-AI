import {Routes} from "@angular/router";
import { SignInComponent } from "./sign-in/sign-in.component";


export default [
  {
    path: 'sign-in',
    loadComponent:  () => import('./sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component').then(c => c.SignUpComponent)
  }
] as Routes
