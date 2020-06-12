import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessCodesComponent } from './accesscodes.component';

describe('AccessCodesComponent', () => {
  let component: AccessCodesComponent;
  let fixture: ComponentFixture<AccessCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
