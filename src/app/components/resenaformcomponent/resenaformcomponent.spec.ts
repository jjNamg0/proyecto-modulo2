import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resenaformcomponent } from './resenaformcomponent';

describe('Resenaformcomponent', () => {
  let component: Resenaformcomponent;
  let fixture: ComponentFixture<Resenaformcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resenaformcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Resenaformcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
