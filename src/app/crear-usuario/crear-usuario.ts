import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.scss']
})
export class CrearUsuario {}
