import { TestBed } from '@angular/core/testing';
import { Cuponesservice } from './cuponesservice';

describe('Cuponesservice', () => {
  let service: Cuponesservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cuponesservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
