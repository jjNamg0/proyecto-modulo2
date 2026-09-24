import { TestBed } from '@angular/core/testing';
import { Exchangerateservice } from './exchangerateservice';

describe('Exchangerateservice', () => {
  let service: Exchangerateservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Exchangerateservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
