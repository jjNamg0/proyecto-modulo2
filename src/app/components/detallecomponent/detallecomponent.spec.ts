import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detallecomponent } from './detallecomponent';

describe('Detallecomponent', () => {
  let component: Detallecomponent;
  let fixture: ComponentFixture<Detallecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detallecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Detallecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
