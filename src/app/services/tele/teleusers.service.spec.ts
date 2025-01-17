import { TestBed } from '@angular/core/testing';

import { TeleusersService } from './teleusers.service';

describe('TeleusersService', () => {
  let service: TeleusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeleusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
