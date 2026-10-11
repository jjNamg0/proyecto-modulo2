import { TestBed } from '@angular/core/testing';
import { Contactoservice } from './contactoservice';

describe('Contactoservice', () => {
  let service: Contactoservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contactoservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
