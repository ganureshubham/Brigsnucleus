import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmateViewComponent } from './assetmate-view.component';

describe('AssetmateViewComponent', () => {
  let component: AssetmateViewComponent;
  let fixture: ComponentFixture<AssetmateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetmateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
