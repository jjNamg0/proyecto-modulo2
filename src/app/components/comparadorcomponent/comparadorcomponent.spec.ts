import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comparadorcomponent } from './comparadorcomponent';

describe('Comparadorcomponent', () => {
  let component: Comparadorcomponent;
  let fixture: ComponentFixture<Comparadorcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Comparadorcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Comparadorcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
