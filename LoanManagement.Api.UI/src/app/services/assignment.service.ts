import { appSetings } from '../settings/appsetings';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../model/apiResponse';
import { IAssignment } from '../model/assignment';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl:string = appSetings.apiUrl

  constructor(private http: HttpClient) { }

  getAssignmentAll()
  {
    return this.http.get<IApiResponse>(`${this.apiUrl}/api/Assignment/All`);//.pipe(map(res => res));
  }
  getAssignmentById(id: number) {
    return this.http.get<IApiResponse>(`${this.apiUrl}/api/Assignment/${id}`);
  }

  // Ejemplo de un método para crear un nuevo assignment
  createAssignment(assignment: any) {
    return this.http.post<IApiResponse>(`${this.apiUrl}/api/Assignment`, assignment);
  }

  // Ejemplo de un método para actualizar un assignment
  updateAssignment(id: number, assignment: any) {
    return this.http.put<IApiResponse>(`${this.apiUrl}/api/Assignment`, assignment);
  }

  // Ejemplo de un método para eliminar un assignment
  deleteAssignment(id: number) {
    return this.http.delete<IApiResponse>(`${this.apiUrl}/api/Assignment/${id}`);
  }

  updateAssignmentDate(id: number, assignment: any) {
    return this.http.put<IApiResponse>(`${this.apiUrl}/api/Assignment/UpdateDate/${id}`,assignment);
  }
}