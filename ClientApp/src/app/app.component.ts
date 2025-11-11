import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { NotificationCenterComponent } from './shared/components/notification-center/notification-center.component';
import { LiveChatComponent } from './shared/components/live-chat/live-chat.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToasterComponent,
    NotificationCenterComponent,
    LiveChatComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Community Car';
}
