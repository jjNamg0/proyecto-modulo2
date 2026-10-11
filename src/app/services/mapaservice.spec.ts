import { TestBed } from '@angular/core/testing';
import { Mapaservice } from './mapaservice';

describe('Mapaservice', () => {
  let service: Mapaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mapaservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
