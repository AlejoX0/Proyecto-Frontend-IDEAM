import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GestionarBrigadas } from './gestionar-brigadas';

describe('GestionarBrigadas', () => {
  let component: GestionarBrigadas;
  let fixture: ComponentFixture<GestionarBrigadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarBrigadas, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarBrigadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
