import { Component, OnInit } from '@angular/core';
import { FileImportService } from '../../service/file-import.service';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import { ApiService } from '../../service/api.service';
import { LoaderService } from '../../layout/loader/loader.service';
import { ToastMessageService } from '../../layout/message/message.service';

@Component({
  selector: 'app-metadata-preview',
  imports: [CardModule, ReactiveFormsModule, HotTableModule],
  templateUrl: './metadata-preview.html',
  styleUrl: './metadata-preview.scss',
})
export class MetadataPreview implements OnInit {
  labelForm!: FormGroup;
  tableData: any;
  tableId: string = 'table-id';
  filePath!: string;
  private hotRegisterer = new HotTableRegisterer();
  fileName!: any;

  constructor(
    private fileImportService: FileImportService,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastMessageService: ToastMessageService,
  ) {}

  ngOnInit(): void {
    this.labelForm = new FormGroup({
      field_delimiter: new FormControl(''),
      row_separator: new FormControl(''),
      field_qualifier: new FormControl(''),
    });
    this.fileImportService.filePayload.subscribe((payload: any) => {
      this.apiService.analyzeFile(payload).subscribe({
        next: (res: any) => {
          if(res) {
          this.loaderService.hide();
          this.toastMessageService.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Meta data Extracted Successfully',
          });
          this.tableData = res?.mappings;
          this.patchValues(res);
          this.filePath = res?.filePath;
          this.fileName = res?.fileName;
        }
      },
        error: (err) => {
          this.loaderService.hide();
          this.toastMessageService.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occurred while extracting metadata',
          });
        },
      });
    });

    this.fileImportService.readyToGenPackage.subscribe((val: boolean) => {
      if(val) {
        this.onSubmit();
      }
    })
  }

  onSubmit() {
    const request = {
      ...this.labelForm.value,
      mappings: this.tableData,
      filePath: this.filePath,
      fileName: this.fileName
    }
    this.loaderService.show();
    this.apiService.genPackage(request).subscribe( {
      next: (res: any) => {
        this.loaderService.hide();
        const blob = new Blob([res.content], { type: 'text/plain' });;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = res.filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: (err) => {
          this.loaderService.hide();
          this.toastMessageService.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occurred while generating package',
          });
        }
    })
  }

  patchValues(res: any) {
    this.getTableInstance()?.loadData(this.tableData);
    this.labelForm.patchValue(res);
  }

  getColumns() {
    return [
      { data: 'src_column_name', title: 'Source Column Name' },
      { data: 'trg_column_name', title: 'Target Column Name' },
      { data: 'datatype', title: 'Data Type' },
    ];
  }

  createTableSettings(): any {
    const nestedHeaders = [
      ['Source Column Name', ' Target Column Name', 'Data Type'],
    ];
    return {
      data: this.tableData,
      nestedHeaders: nestedHeaders,
      columns: this.getColumns(),
      colHeaders: true,
      rowHeaders: true,
      height: 'auto',
      overflow: 'auto',
      manualColumnResize: true,
      manualRowMove: true,
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: ['row_above', 'row_below', 'remove_row', 'undo', 'redo'],
      colWidths: [220, 220, 200],
    };
  }

  getTableInstance() {
    return this.hotRegisterer?.getInstance(this.tableId);
  }
}
