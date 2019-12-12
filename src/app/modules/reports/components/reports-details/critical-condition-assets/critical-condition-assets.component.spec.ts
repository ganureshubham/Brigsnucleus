import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalConditionAssetsComponent } from './critical-condition-assets.component';

describe('CriticalConditionAssetsComponent', () => {
  let component: CriticalConditionAssetsComponent;
  let fixture: ComponentFixture<CriticalConditionAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalConditionAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalConditionAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
