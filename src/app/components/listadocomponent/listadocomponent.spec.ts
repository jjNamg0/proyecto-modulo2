import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listadocomponent } from './listadocomponent';

describe('Listadocomponent', () => {
  let component: Listadocomponent;
  let fixture: ComponentFixture<Listadocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listadocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Listadocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
