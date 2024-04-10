import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;
  constructor(private authService: AuthService) {}

  onSignup(form: NgForm) {
    if (!form.invalid) this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    return;
  }
}
