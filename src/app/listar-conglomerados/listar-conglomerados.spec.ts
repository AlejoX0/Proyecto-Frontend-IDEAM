import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConglomerados } from './listar-conglomerados';

describe('ListarConglomerados', () => {
  let component: ListarConglomerados;
  let fixture: ComponentFixture<ListarConglomerados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarConglomerados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarConglomerados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
