import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudnaryComponent } from './cloudnary.component';

describe('CloudnaryComponent', () => {
  let component: CloudnaryComponent;
  let fixture: ComponentFixture<CloudnaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudnaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudnaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
