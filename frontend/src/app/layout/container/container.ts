import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-container',
  imports: [Header, RouterModule],
  templateUrl: './container.html',
  styleUrl: './container.scss'
})
export class Container {

}
