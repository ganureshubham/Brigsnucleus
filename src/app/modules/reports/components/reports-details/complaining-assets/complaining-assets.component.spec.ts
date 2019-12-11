import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainingAssetsComponent } from './complaining-assets.component';

describe('ComplainingAssetsComponent', () => {
  let component: ComplainingAssetsComponent;
  let fixture: ComponentFixture<ComplainingAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainingAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainingAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
