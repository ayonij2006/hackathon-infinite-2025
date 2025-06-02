import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileImportService {
  private _nextClicked = new Subject<boolean>();
  private _disableNext = new Subject<boolean>();
  private _selectedFileContent = new Subject<string>();

  message$ = this._nextClicked.asObservable();
  isNextbtnDisabled = this._disableNext.asObservable();
  selectedFileContent = this._selectedFileContent.asObservable();

  setNextClicked(val: boolean) {
    this._nextClicked.next(val);
  }

  setIsNextBtnDisabled(val: boolean) {
    this._disableNext.next(val);
  }

  setSelectedFileContent(val: string) {
    this._selectedFileContent.next(val);
  }
}