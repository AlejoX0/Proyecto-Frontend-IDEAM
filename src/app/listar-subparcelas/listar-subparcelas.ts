import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-listar-subparcelas',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-subparcelas.html',
  styleUrls: ['./listar-subparcelas.scss']
})
export class ListarSubparcelas {}
