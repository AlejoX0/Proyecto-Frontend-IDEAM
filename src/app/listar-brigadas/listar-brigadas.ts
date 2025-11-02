import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-listar-brigadas',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-brigadas.html',
  styleUrls: ['./listar-brigadas.scss']
})
export class ListarBrigadas {}
