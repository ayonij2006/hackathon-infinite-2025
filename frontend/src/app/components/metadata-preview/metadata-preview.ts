import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  private hotRegisterer = new HotTableRegisterer();

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
        next: (res) => {
          this.loaderService.hide();
          this.toastMessageService.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Meta data Extracted Successfully',
          });
          const mockRes = {
            field_qualifier: '',
            field_delimiter: '|',
            row_separator: 'CRLF',
            mappings: [
              {
                src_column_name: 'id',
                trg_column_name: 'id',
                datatype: 'identity',
              },
              {
                src_column_name: 'first_name',
                trg_column_name: 'ifirst_named',
                datatype: 'varchar',
              },
              {
                src_column_name: 'last_name',
                trg_column_name: 'last_name',
                datatype: 'varchar',
              },
              {
                src_column_name: 'last_name',
                trg_column_name: 'last_name',
                datatype: 'varchar',
              },
              {
                src_column_name: 'gender',
                trg_column_name: 'gender',
                datatype: 'varchar',
              },
              {
                src_column_name: 'ip_address',
                trg_column_name: 'ip_address',
                datatype: 'varchar',
              },
            ]
          };
          this.tableData = mockRes?.mappings;
          //TODO: remove mock data and replace mockRes by res
          this.patchValues(mockRes);
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
      mappings: this.tableData
    }
    this.loaderService.show();
    this.apiService.genPackage(request).subscribe( {
      next: (res: any) => {
        this.loaderService.hide();

        //TODO: Download SSIS package
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
      height: 400,
      overflow: 'auto',
      manualColumnResize: true,
      manualRowMove: true,
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: ['row_above', 'row_below', 'remove_row', 'undo', 'redo'],
      colWidths: [200, 200, 200],
    };
  }

  getTableInstance() {
    return this.hotRegisterer?.getInstance(this.tableId);
  }
}
