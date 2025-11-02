import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-listar-conglomerados',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-conglomerados.html',
  styleUrls: ['./listar-conglomerados.scss']
})
export class ListarConglomerados {}
