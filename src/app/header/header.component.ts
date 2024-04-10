import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.getIsAuth();
    this.authListenerSubs = this.auth
      .getAuthStateListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  onLogout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
