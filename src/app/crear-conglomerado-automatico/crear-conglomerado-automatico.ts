import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ConglomeradoService } from '../core/services/conglomerado.service';

@Component({
  selector: 'app-crear-conglomerado-automatico',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './crear-conglomerado-automatico.html',
  styleUrls: ['./crear-conglomerado-automatico.scss']
})
export class CrearConglomeradoAutomatico {
  constructor(private service: ConglomeradoService) {}

  generarConglomerados(): void {
    if (!confirm('¿Deseas generar conglomerados automáticamente?')) return;

    this.service.crearAutomatico().subscribe({
      next: (res) => {
        alert(`✅ ${res.message}`);
        console.log('Resultado:', res);
      },
      error: (err) => {
        console.error('Error al generar conglomerados automáticos:', err);
        alert('❌ No se pudo generar conglomerados');
      },
    });
  }
}
