import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearConglomeradoManual } from './crear-conglomerado-manual';

describe('CrearConglomeradoManual', () => {
  let component: CrearConglomeradoManual;
  let fixture: ComponentFixture<CrearConglomeradoManual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearConglomeradoManual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearConglomeradoManual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
