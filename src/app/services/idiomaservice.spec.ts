import { TestBed } from '@angular/core/testing';
import { Idiomaservice } from './idiomaservice';

describe('Idiomaservice', () => {
  let service: Idiomaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Idiomaservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
