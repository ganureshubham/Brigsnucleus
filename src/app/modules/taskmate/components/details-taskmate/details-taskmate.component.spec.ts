import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTaskmateComponent } from './details-taskmate.component';

describe('DetailsTaskmateComponent', () => {
  let component: DetailsTaskmateComponent;
  let fixture: ComponentFixture<DetailsTaskmateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTaskmateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTaskmateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
