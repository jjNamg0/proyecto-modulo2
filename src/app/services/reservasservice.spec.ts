import { TestBed } from '@angular/core/testing';
import { Reservasservice } from './reservasservice';

describe('Reservasservice', () => {
  let service: Reservasservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reservasservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
