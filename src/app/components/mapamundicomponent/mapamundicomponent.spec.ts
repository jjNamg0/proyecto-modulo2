import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mapamundicomponent } from './mapamundicomponent';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('Mapamundicomponent', () => {
  let component: Mapamundicomponent;
  let fixture: ComponentFixture<Mapamundicomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mapamundicomponent],
      imports: [CommonModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapamundicomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
