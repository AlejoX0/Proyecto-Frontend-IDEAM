import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarConglomerado } from './asignar-conglomerado';

describe('AsignarConglomerado', () => {
  let component: AsignarConglomerado;
  let fixture: ComponentFixture<AsignarConglomerado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarConglomerado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarConglomerado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
