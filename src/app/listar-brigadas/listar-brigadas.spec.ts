import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarBrigadas } from './listar-brigadas';

describe('ListarBrigadas', () => {
  let component: ListarBrigadas;
  let fixture: ComponentFixture<ListarBrigadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarBrigadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarBrigadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
