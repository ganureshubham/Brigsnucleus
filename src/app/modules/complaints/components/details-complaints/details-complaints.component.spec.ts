import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComplaintsComponent } from './details-complaints.component';

describe('DetailsComplaintsComponent', () => {
  let component: DetailsComplaintsComponent;
  let fixture: ComponentFixture<DetailsComplaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
