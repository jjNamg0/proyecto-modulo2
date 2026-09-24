import { TestBed } from '@angular/core/testing';
import { Geocodingservice } from './geocodingservice';

describe('Geocodingservice', () => {
  let service: Geocodingservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geocodingservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
