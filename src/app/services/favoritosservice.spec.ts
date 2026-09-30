import { TestBed } from '@angular/core/testing';
import { Favoritosservice } from './favoritosservice';

describe('Favoritosservice', () => {
  let service: Favoritosservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Favoritosservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
