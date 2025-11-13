import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ConglomeradoService } from '../core/services/conglomerado.service';
import { FormsModule } from '@angular/forms'; // 👈 ¡Importante!

@Component({
  selector: 'app-crear-conglomerado-automatico',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule], // 👈 ¡Importante!
  templateUrl: './crear-conglomerado-automatico.html',
  styleUrls: ['./crear-conglomerado-automatico.scss']
})
export class CrearConglomeradoAutomatico {
  
  // --- Propiedades para el formulario ---
  cantidad: number | null = null;
  region: string = ''; // 👈 CAMBIO: Valor inicial para el <select>

  // --- NUEVO: Lista de departamentos ---
  // (Puedes llenar esto desde una API si lo prefieres, 
  // pero una lista estática es más simple para este formulario)
  listaDepartamentos: string[] = [
    'Amazonas',
    'Antioquia',
    'Arauca',
    'Atlántico',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Casanare',
    'Cauca',
    'Cesar',
    'Chocó',
    'Córdoba',
    'Cundinamarca',
    'Guainía',
    'Guaviare',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Putumayo',
    'Quindío',
    'Risaralda',
    'San Andrés y Providencia',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada'
  ];

  // --- Manejadores de estado ---
  cargando = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private service: ConglomeradoService) {}

  generarConglomerados(): void {
    // 1. 👈 CAMBIO: Validación actualizada para el <select>
    if (!this.cantidad || this.cantidad <= 0 || !this.region) {
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // 2. Resetear estados y mostrar carga
    this.cargando = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    // 3. Preparar los parámetros para el servicio
    const params = {
      cantidad: this.cantidad,
      region: this.region
    };

    // 4. Llamar al servicio con los parámetros
    this.service.crearAutomatico(params).subscribe({
      next: (res: any) => { 
        this.cargando = false;
        this.mensajeExito = res.message || `✅ ${this.cantidad} conglomerados generados para ${this.region}.`;
        console.log('Resultado:', res);
        
        // Limpiar formulario
        this.cantidad = null;
        this.region = ''; // 👈 CAMBIO: Resetear a valor inicial
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.error || '❌ No se pudo generar conglomerados';
        console.error('Error al generar conglomerados automáticos:', err);
      },
    });
  }
}