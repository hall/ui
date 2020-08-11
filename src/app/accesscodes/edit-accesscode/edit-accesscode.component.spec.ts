import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessCodeComponent } from './edit-accesscode.component';

describe('NewAccessCodeComponent', () => {
  let component: EditAccessCodeComponent;
  let fixture: ComponentFixture<EditAccessCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccessCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccessCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
