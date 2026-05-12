import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-main',
  templateUrl: './page-main.html',
  styleUrls: ['./page-main.scss'],
  imports: [RouterOutlet, SidebarComponent],
})
export class MainPage {}
