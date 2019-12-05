import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskmateComponent } from './view-taskmate.component';

describe('ViewTaskmateComponent', () => {
  let component: ViewTaskmateComponent;
  let fixture: ComponentFixture<ViewTaskmateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTaskmateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskmateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
