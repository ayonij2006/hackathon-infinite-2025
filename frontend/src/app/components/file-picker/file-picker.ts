
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-file-picker',

  templateUrl: './file-picker.html',
  styleUrl: './file-picker.scss',
 
    imports: [FileUpload, ButtonModule, ToastModule, CommonModule],
    providers: [MessageService]
})
export class FilePicker {

    files = [];
    constructor(private messageService: MessageService) {}

     choose(event: any, callback: any) {
        callback();
    }

    uploadFile(event: any) {
      console.log(event)
      this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

     onSelectedFiles(event: any) {
        this.files = event.currentFiles;
       console.log(this.files)
    }



}