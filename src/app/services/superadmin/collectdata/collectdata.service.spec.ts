import { TestBed } from '@angular/core/testing';

import { CollectdataService } from './collectdata.service';

describe('CollectdataService', () => {
  let service: CollectdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
