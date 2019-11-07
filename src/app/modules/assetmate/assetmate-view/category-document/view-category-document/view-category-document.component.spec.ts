import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCategoryDocumentComponent } from './view-category-document.component';

describe('ViewCategoryDocumentComponent', () => {
  let component: ViewCategoryDocumentComponent;
  let fixture: ComponentFixture<ViewCategoryDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCategoryDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCategoryDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
