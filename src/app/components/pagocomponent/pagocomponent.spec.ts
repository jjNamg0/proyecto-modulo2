import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagocomponent } from './pagocomponent';

describe('Pagocomponent', () => {
  let component: Pagocomponent;
  let fixture: ComponentFixture<Pagocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
