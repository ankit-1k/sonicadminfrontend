import { TestBed } from '@angular/core/testing';

import { PhonemailerService } from './phonemailer.service';

describe('PhonemailerService', () => {
  let service: PhonemailerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhonemailerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
