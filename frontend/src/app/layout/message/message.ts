import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastMessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.html',
  styleUrl: './message.scss',
  imports: [ToastModule],
  providers: [MessageService],
})
export class Message implements OnInit {
  constructor(
    private toastMessageService: ToastMessageService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.toastMessageService.show$.subscribe((msg: any) => {
      this.messageService.add(msg);
    });
  }
}
