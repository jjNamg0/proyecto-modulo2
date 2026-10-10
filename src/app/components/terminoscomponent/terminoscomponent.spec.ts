import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Terminoscomponent } from './terminoscomponent';

describe('Terminoscomponent', () => {
  let component: Terminoscomponent;
  let fixture: ComponentFixture<Terminoscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Terminoscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Terminoscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
