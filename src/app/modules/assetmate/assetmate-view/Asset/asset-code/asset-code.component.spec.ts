import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCodeComponent } from './asset-code.component';

describe('AssetCodeComponent', () => {
  let component: AssetCodeComponent;
  let fixture: ComponentFixture<AssetCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
