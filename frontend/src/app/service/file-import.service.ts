import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileImportService {
  private _nextClicked = new Subject<boolean>();
  private _disableNext = new Subject<boolean>();
  private _selectedFileContent = new Subject<string>();
  private _filePayload = new Subject<any>();
  private _readyToGenPackage = new Subject<boolean>();

  message$ = this._nextClicked.asObservable();
  isNextbtnDisabled = this._disableNext.asObservable();
  selectedFileContent = this._selectedFileContent.asObservable();
  filePayload = this._filePayload.asObservable();
  readyToGenPackage = this._readyToGenPackage.asObservable();

  setNextClicked(val: boolean) {
    this._nextClicked.next(val);
  }

  setIsNextBtnDisabled(val: boolean) {
    this._disableNext.next(val);
  }

  setSelectedFileContent(val: string) {
    this._selectedFileContent.next(val);
  }

  setFilePayload(val: any) {
    this._filePayload.next(val);
  }

  setReadyToGenPackage(val: boolean) {
    this._readyToGenPackage.next(val);
  }
}
