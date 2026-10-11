import { TestBed } from '@angular/core/testing';
import { Comparadorservice } from './comparadorservice';

describe('Comparadorservice', () => {
  let service: Comparadorservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comparadorservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
