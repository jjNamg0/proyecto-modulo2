import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comprobantecomponent } from './comprobantecomponent';

describe('Comprobantecomponent', () => {
  let component: Comprobantecomponent;
  let fixture: ComponentFixture<Comprobantecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Comprobantecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Comprobantecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
