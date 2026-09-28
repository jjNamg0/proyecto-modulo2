import { TestBed } from '@angular/core/testing';
import { Climaservice } from './climaservice';

describe('Climaservice', () => {
  let service: Climaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Climaservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
