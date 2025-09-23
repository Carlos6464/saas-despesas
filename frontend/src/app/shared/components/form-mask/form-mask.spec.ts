import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMask } from './form-mask';

describe('FormMask', () => {
  let component: FormMask;
  let fixture: ComponentFixture<FormMask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
