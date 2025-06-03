import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPreview } from './metadata-preview';

describe('MetadataPreview', () => {
  let component: MetadataPreview;
  let fixture: ComponentFixture<MetadataPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetadataPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
