import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectdataComponent } from './collectdata.component';

describe('CollectdataComponent', () => {
  let component: CollectdataComponent;
  let fixture: ComponentFixture<CollectdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
