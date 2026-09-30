import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favoritoscomponent } from './favoritoscomponent';

describe('Favoritoscomponent', () => {
  let component: Favoritoscomponent;
  let fixture: ComponentFixture<Favoritoscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favoritoscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Favoritoscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
