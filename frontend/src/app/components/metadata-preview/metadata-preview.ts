import { Component, Input, OnInit } from '@angular/core';
import { FileImportService } from '../../service/file-import.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-metadata-preview',
  imports: [CardModule],
  templateUrl: './metadata-preview.html',
  styleUrl: './metadata-preview.scss'
})
export class MetadataPreview implements OnInit{

  @Input() fileContent!: string;

  constructor(private fileImportService: FileImportService) {

  }

  ngOnInit(): void {
    //console.log(this.fileContent)
  }

}
