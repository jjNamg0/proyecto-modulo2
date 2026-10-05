import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Publicarcomponent } from './publicarcomponent';

describe('Publicarcomponent', () => {
  let component: Publicarcomponent;
  let fixture: ComponentFixture<Publicarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Publicarcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Publicarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
