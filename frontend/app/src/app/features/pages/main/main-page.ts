import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.scss'],
  imports: [HeaderComponent, RouterOutlet],
})
export class MainPage {}
