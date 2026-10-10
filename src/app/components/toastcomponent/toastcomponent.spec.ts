import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toastcomponent } from './toastcomponent';

describe('Toastcomponent', () => {
  let component: Toastcomponent;
  let fixture: ComponentFixture<Toastcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Toastcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Toastcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
