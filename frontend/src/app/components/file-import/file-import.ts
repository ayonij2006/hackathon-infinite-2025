import { Component, NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilePicker } from "../file-picker/file-picker";

@Component({
  selector: 'app-file-import',
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    FilePicker
],
  templateUrl: './file-import.html',
  styleUrl: './file-import.scss'
})
export class FileImport {

    activeStep: number = 1;
}