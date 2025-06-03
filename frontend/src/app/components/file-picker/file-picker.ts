import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileImportService } from '../../service/file-import.service';
import { LoaderService } from '../../layout/loader/loader.service';
import { ToastMessageService } from '../../layout/message/message.service';

@Component({
  selector: 'app-file-picker',

  templateUrl: './file-picker.html',
  styleUrl: './file-picker.scss',
  imports: [FileUpload, ButtonModule, CommonModule, CardModule],
})
export class FilePicker implements OnInit {
  @Output() onFileSelect = new EventEmitter<string>();
  @Output() payload$ = new EventEmitter<any>();
  files = [];
  fileContent: any;
  
  constructor(
    private fileImportService: FileImportService,
    private loaderService: LoaderService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.fileImportService.message$.subscribe((res: any) => {
      if (res) {
        this.customUpload(this.files);
        this.fileImportService.setSelectedFileContent(this.fileContent);
        this.onFileSelect.emit(this.fileContent);
      }
    });
  }

  choose(event: any, callback: any) {
    callback();
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles[0];
    this.readFileContent(this.files);
    this.fileImportService.setIsNextBtnDisabled(false);
  }

  readFileContent(file: any): void {
    this.loaderService.show();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        const fullText = e.target.result as string;
        const lines = fullText.split(/\r?\n/);
        this.fileContent = lines.slice(0, 11);
      } else {
        this.fileContent = e.target.result;
      }
    };

    reader.onerror = (e: any) => {
      console.error('File could not be read:', e.target.error);
    };

    if (file.type.startsWith('text/') || file.type === 'application/json') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    this.loaderService.hide();
  }

  customUpload(file: any): void {
    this.loaderService.show();
    this.readFileAsArrayBuffer(file)
      .then((arrayBuffer: ArrayBuffer) => {
        const base64String = this.arrayBufferToBase64(arrayBuffer);
        const payload = { data: base64String, fileName: file.name };
        this.payload$.emit(payload);
        this.fileImportService.setFilePayload(payload);
        this.loaderService.hide();
      })
      .catch((error: any) => {
        this.loaderService.hide();
        console.error('Error reading file:', error);
        
      });
  }

  readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        resolve(e.target.result);
      };

      reader.onerror = (e: any) => {
        reject(e.target.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
