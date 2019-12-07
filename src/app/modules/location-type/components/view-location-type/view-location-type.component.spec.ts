import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLocationTypeComponent } from './view-location-type.component';

describe('ViewLocationTypeComponent', () => {
  let component: ViewLocationTypeComponent;
  let fixture: ComponentFixture<ViewLocationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLocationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLocationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
