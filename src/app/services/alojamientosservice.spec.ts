import { TestBed } from '@angular/core/testing';
import { Alojamientosservice } from './alojamientosservice';

describe('Alojamientosservice', () => {
  let service: Alojamientosservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alojamientosservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
