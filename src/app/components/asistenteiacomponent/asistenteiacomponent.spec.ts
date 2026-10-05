import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Asistenteiacomponent } from './asistenteiacomponent';

describe('Asistenteiacomponent', () => {
  let component: Asistenteiacomponent;
  let fixture: ComponentFixture<Asistenteiacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Asistenteiacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Asistenteiacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
