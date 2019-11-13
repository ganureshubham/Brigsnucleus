import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumateComponent } from './add-documate.component';

describe('AddDocumateComponent', () => {
  let component: AddDocumateComponent;
  let fixture: ComponentFixture<AddDocumateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocumateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
