import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comparadorbarracomponent } from './comparadorbarracomponent';

describe('Comparadorbarracomponent', () => {
  let component: Comparadorbarracomponent;
  let fixture: ComponentFixture<Comparadorbarracomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Comparadorbarracomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Comparadorbarracomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
