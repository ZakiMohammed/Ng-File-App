import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { UploadVergeComponent } from './upload-verge.component';

describe('UploadVergeComponent', () => {
  let component: UploadVergeComponent;
  let fixture: ComponentFixture<UploadVergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadVergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
