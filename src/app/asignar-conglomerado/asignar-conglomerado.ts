import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-asignar-conglomerado',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './asignar-conglomerado.html',
  styleUrls: ['./asignar-conglomerado.scss']
})
export class AsignarConglomerado {}
