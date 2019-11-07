import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmateDetailsComponent } from './assetmate-details.component';

describe('AssetmateDetailsComponent', () => {
  let component: AssetmateDetailsComponent;
  let fixture: ComponentFixture<AssetmateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetmateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
