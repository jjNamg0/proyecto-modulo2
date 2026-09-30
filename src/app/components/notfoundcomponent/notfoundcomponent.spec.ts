import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notfoundcomponent } from './notfoundcomponent';

describe('Notfoundcomponent', () => {
  let component: Notfoundcomponent;
  let fixture: ComponentFixture<Notfoundcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notfoundcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Notfoundcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
