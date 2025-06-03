import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImport } from './file-import';

describe('FileImport', () => {
  let component: FileImport;
  let fixture: ComponentFixture<FileImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileImport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileImport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
