import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearConglomeradoAutomatico } from './crear-conglomerado-automatico';

describe('CrearConglomeradoAutomatico', () => {
  let component: CrearConglomeradoAutomatico;
  let fixture: ComponentFixture<CrearConglomeradoAutomatico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearConglomeradoAutomatico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearConglomeradoAutomatico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
