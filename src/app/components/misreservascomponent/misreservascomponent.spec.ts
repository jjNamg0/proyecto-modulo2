import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Misreservascomponent } from './misreservascomponent';

describe('Misreservascomponent', () => {
  let component: Misreservascomponent;
  let fixture: ComponentFixture<Misreservascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Misreservascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Misreservascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
