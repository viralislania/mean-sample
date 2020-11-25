import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    isloading = false;

    constructor(public authService: AuthService) {}

    onSignup(form: NgForm): void {
        this.authService.createUser(form.value.email, form.value.password);
    }
}
