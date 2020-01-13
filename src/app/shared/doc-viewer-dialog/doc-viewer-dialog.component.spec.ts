import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewerDialogComponent } from './doc-viewer-dialog.component';

describe('DocViewerDialogComponent', () => {
  let component: DocViewerDialogComponent;
  let fixture: ComponentFixture<DocViewerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocViewerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
