import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelusersComponent } from './telusers.component';

describe('TelusersComponent', () => {
  let component: TelusersComponent;
  let fixture: ComponentFixture<TelusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
