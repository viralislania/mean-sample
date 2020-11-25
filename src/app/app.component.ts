import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.autoLogin();
    // this.registerSW();
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: true, registrationStrategy: 'registerImmediately' });

  }

  // registerSW(): void {
  //   if (!('serviceWorker' in navigator)) {
  //     console.log('Service worker is not supported');
  //     return;
  //   }

  //   navigator.serviceWorker.register('sw.js')
  //     .then(registraition => {
  //       console.log('SW registration success ', registraition);
  //     });
  // }

}

