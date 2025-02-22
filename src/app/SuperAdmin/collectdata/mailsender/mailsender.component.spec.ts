import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailsenderComponent } from './mailsender.component';

describe('MailsenderComponent', () => {
  let component: MailsenderComponent;
  let fixture: ComponentFixture<MailsenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailsenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailsenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
