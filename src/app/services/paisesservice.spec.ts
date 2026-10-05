import { TestBed } from '@angular/core/testing';
import { Paisesservice } from './paisesservice';

describe('Paisesservice', () => {
  let service: Paisesservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Paisesservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
