import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contactocomponent } from './contactocomponent';

describe('Contactocomponent', () => {
  let component: Contactocomponent;
  let fixture: ComponentFixture<Contactocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Contactocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Contactocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
