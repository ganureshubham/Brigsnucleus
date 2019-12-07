import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppImgDialogComponent } from './app-img-dialog.component';

describe('AppImgDialogComponent', () => {
  let component: AppImgDialogComponent;
  let fixture: ComponentFixture<AppImgDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppImgDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppImgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
