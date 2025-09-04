import { Component } from '@angular/core';
import { Header} from '../../shared/components/header/header'
import { Sidebar } from '../../shared/components/sidebar/sidebar'
import { CardModule } from 'primeng/card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [Header, CardModule,RouterOutlet,Sidebar],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {

}
