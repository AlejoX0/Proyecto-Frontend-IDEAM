import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBrigada } from './crear-brigada';

describe('CrearBrigada', () => {
  let component: CrearBrigada;
  let fixture: ComponentFixture<CrearBrigada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearBrigada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearBrigada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
