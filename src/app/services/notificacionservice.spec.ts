import { TestBed } from '@angular/core/testing';
import { Notificacionservice } from './notificacionservice';

describe('Notificacionservice', () => {
  let service: Notificacionservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notificacionservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
