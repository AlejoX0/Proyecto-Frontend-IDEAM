import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-brigada',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './crear-brigada.html',
  styleUrls: ['./crear-brigada.scss']
})
export class CrearBrigada {}
