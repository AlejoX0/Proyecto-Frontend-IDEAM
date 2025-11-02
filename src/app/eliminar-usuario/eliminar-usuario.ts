import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-eliminar-usuario',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './eliminar-usuario.html',
  styleUrls: ['./eliminar-usuario.scss']
})
export class EliminarUsuario {}
