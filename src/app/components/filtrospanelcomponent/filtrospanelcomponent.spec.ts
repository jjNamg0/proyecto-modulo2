import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Filtrospanelcomponent } from './filtrospanelcomponent';

describe('Filtrospanelcomponent', () => {
  let component: Filtrospanelcomponent;
  let fixture: ComponentFixture<Filtrospanelcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filtrospanelcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Filtrospanelcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
