import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-conglomerado-manual',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './crear-conglomerado-manual.html',
  styleUrls: ['./crear-conglomerado-manual.scss']
})
export class CrearConglomeradoManual {}
