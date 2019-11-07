import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryDocumentComponent } from './add-category-document.component';

describe('AddCategoryDocumentComponent', () => {
  let component: AddCategoryDocumentComponent;
  let fixture: ComponentFixture<AddCategoryDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCategoryDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
