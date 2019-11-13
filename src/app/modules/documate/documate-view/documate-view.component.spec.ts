import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumateViewComponent } from './documate-view.component';

describe('DocumateViewComponent', () => {
  let component: DocumateViewComponent;
  let fixture: ComponentFixture<DocumateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
