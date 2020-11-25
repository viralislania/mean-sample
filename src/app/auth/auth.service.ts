import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = environment.baseUrl +  'auth/';
    private token: string;
    private authStatus = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    getToken(): string {
        return this.token;
    }

    getAuthStatus(): Observable<boolean> {
        return this.authStatus.asObservable();
    }

    isUserAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    createUser(email: string, password: string): void {
        const authdata: AuthData = { email, password };

        this.http.post(this.url + 'signup', authdata)
            .subscribe(response => {
                console.log(response);
            });
    }

    login(email: string, password: string): void {
        const authdata: AuthData = { email, password };

        this.http.post<{ token: string; expiresIn: number }>(this.url + 'login', authdata)
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    const expiryDuration = response.expiresIn;
                    this.setTokenExpiryTimer(expiryDuration);
                    this.authStatus.next(true);
                    this.isAuthenticated = true;
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiryDuration * 1000);

                    this.saveAuthToken(this.token, expirationDate);
                    this.router.navigate(['/']);
                }
            });

    }

    logout(): void {
        this.token = null;
        this.isAuthenticated = false;
        this.clearAuthToken();
        clearTimeout(this.tokenTimer);
        this.authStatus.next(false);
        this.router.navigate(['/']);

    }

    autoLogin(): void {
        const authInfo = this.getAuthData();
        if (!authInfo) return;
        const expiresIn = authInfo.expiryDate.getTime() - (new Date().getTime());
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.setTokenExpiryTimer(expiresIn / 1000);
            this.isAuthenticated = true;
            this.authStatus.next(true);
        }
    }

    private saveAuthToken(token: string, expiryDate: Date): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiry', expiryDate.toISOString());
    }

    private clearAuthToken(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiry');
    }

    private setTokenExpiryTimer(duration: number): void {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private getAuthData(): any {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiry');
        if (!token || !expiryDate) return;
        return { token, expiryDate: new Date(expiryDate) };
    }
}
