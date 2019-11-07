import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmateLayoutComponent } from './assetmate-layout.component';

describe('AssetmateLayoutComponent', () => {
  let component: AssetmateLayoutComponent;
  let fixture: ComponentFixture<AssetmateLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetmateLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
