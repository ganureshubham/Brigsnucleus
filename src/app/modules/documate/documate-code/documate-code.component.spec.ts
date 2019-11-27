import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumateCodeComponent } from './documate-code.component';

describe('DocumateCodeComponent', () => {
  let component: DocumateCodeComponent;
  let fixture: ComponentFixture<DocumateCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumateCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
