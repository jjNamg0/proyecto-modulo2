import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cotizadorcomponent } from './cotizadorcomponent';

describe('Cotizadorcomponent', () => {
  let component: Cotizadorcomponent;
  let fixture: ComponentFixture<Cotizadorcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cotizadorcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Cotizadorcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
