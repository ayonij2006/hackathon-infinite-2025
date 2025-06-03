import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from "./layout/loader/loader";
import { Message } from "./layout/message/message";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, Message],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'GeneSSIS';
}
