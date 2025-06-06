import { Component, NgModule, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilePicker } from '../file-picker/file-picker';
import { FileImportService } from '../../service/file-import.service';
import { MetadataPreview } from "../metadata-preview/metadata-preview";
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-file-import',
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    FilePicker,
    MetadataPreview,
    CardModule
],
  templateUrl: './file-import.html',
  styleUrl: './file-import.scss',
})
export class FileImport implements OnInit  {

  activeStep: number = 1;
  disableFilePreviewNxt: boolean = true;
  fileContent!: any;
  constructor(private fileImportService: FileImportService) {}

  ngOnInit(): void {
    this.fileImportService.isNextbtnDisabled.subscribe((res: any) => {
      this.disableFilePreviewNxt = res;
    })
  }

  notifyNext() {
    this.fileImportService.setNextClicked(true);
  }

  notifyToGenPackage() {
    this.fileImportService.setReadyToGenPackage(true);
  }

  onFileSelect(event: any) {
    this.fileContent = event?.join("\n");
  }
}
