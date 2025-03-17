import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonemailerComponent } from './phonemailer.component';

describe('PhonemailerComponent', () => {
  let component: PhonemailerComponent;
  let fixture: ComponentFixture<PhonemailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhonemailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhonemailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
