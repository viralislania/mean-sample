import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    isloading = false;
    constructor(public authService: AuthService) { }

    onLogin(form: NgForm): void {
        this.authService.login(form.value.email, form.value.password);
    }
}
