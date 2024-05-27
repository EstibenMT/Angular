import { AssignmentService } from '../../services/assignment.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IApiResponse } from '../../model/apiResponse';
import { IAssignment } from '../../model/assignment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule, 
    MatFormFieldModule, 
    MatSelectModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent {
  private assignmentService = inject(AssignmentService);
  public assigmentList:IAssignment[] = [];
  public displayedColumns: string[] = [
    'id', 
    'deviceType', 
    'serial', 
    'brand', 
    'name', 
    'student', 
    'loanDate', 
    'deadline', 
    'Accion'
  ];
  filtroTipo: string = 'dni';
  filtroTexto: string = '';

  
  constructor(
    private router: Router
  ){
    this.getAssignmentAll();
  }

  formatearFechaConHora(fechaOriginal: string): string {
    const fecha = new Date(fechaOriginal);
    const datePipe = new DatePipe('es-CO');
    return datePipe.transform(fecha, 'dd/MM/yyyy HH:mm:ss') || '';
  }

  getAssignmentAll(){
    this.assignmentService.getAssignmentAll().subscribe({
      next: (data) => {
        if (data.data.length > 0) {
          this.assigmentList = data.data
        } else {
          console.log(`No hay informacion`);
        }
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  getAssignmentById(){
    this.router.navigate(['/assignment/',0]);
  }

  updateAssignment(objet:IAssignment){
    this.router.navigate(['/assignment/',objet.id]);
  }

  deleteAssignment(objet:IAssignment){
    if(confirm(`Desea eliminar la asignación con número ${objet.id}`)){
      this.assignmentService.deleteAssignment(objet.id).subscribe({
        next:(data:IApiResponse ) =>{
          if(data.status == 200){
            this.getAssignmentAll();
          }else{
            alert(data.message)
          }
        },
        error:(err) => {
          console.log(err.message);
        }
      });
    }
  }

  updateAssignmentDate(objet:IAssignment){
    if(confirm(`Desea realizar la entregadel equipo con serie ${objet.device?.serial}`)){
      this.assignmentService.updateAssignmentDate(objet.id, objet).subscribe({
        next:(data:IApiResponse ) =>{
          if(data.status == 200){
            this.getAssignmentAll();
          }else{
            alert(data.message)
          }
        },
        error:(err) => {
          alert(err.message);
        }
      });
    }
  }

  filtrarLista(): IAssignment[] {
    if (!this.filtroTexto.trim()) {
      // Si el campo de filtro está vacío, mostrar toda la lista
      return this.assigmentList;
    }

    // Filtrar la lista según el tipo seleccionado y el texto ingresado, ignorando mayúsculas y minúsculas
    return this.assigmentList.filter(assignment => {
      if (this.filtroTipo === 'dni') {
        return (
          assignment.student?.identificationCard.toLowerCase().includes(this.filtroTexto.toLowerCase())
        );
      } else if (this.filtroTipo === 'serial') {
        return (
          assignment.device?.serial.toLowerCase().includes(this.filtroTexto.toLowerCase())
        );
      }
      return false;
    });
  }
}
