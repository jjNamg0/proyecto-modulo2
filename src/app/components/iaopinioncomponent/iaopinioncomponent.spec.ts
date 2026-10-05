import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Iaopinioncomponent } from './iaopinioncomponent';

describe('Iaopinioncomponent', () => {
  let component: Iaopinioncomponent;
  let fixture: ComponentFixture<Iaopinioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iaopinioncomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Iaopinioncomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
