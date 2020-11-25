import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy{

    userIsAuthenticated = false;
    authStatusSubscription: Subscription;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userIsAuthenticated = this.authService.isUserAuthenticated();
        this.authStatusSubscription = this.authService.getAuthStatus()
        .subscribe(authStatus => {
            this.userIsAuthenticated = authStatus;
        });
    }

    ngOnDestroy(): void {
        this.authStatusSubscription.unsubscribe();
    }

    onLogout(): void {
        this.authService.logout();
    }
}
