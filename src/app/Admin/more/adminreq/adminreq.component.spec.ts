import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreqComponent } from './adminreq.component';

describe('AdminreqComponent', () => {
  let component: AdminreqComponent;
  let fixture: ComponentFixture<AdminreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
