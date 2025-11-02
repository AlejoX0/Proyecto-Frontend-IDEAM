import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-conglomerado-automatico',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './crear-conglomerado-automatico.html',
  styleUrls: ['./crear-conglomerado-automatico.scss']
})
export class CrearConglomeradoAutomatico {}
