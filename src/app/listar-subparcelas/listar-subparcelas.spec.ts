import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSubparcelas } from './listar-subparcelas';

describe('ListarSubparcelas', () => {
  let component: ListarSubparcelas;
  let fixture: ComponentFixture<ListarSubparcelas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSubparcelas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarSubparcelas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
