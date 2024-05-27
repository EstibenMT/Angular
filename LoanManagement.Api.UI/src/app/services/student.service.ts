import { appSetings } from '../settings/appsetings';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../model/apiResponse';
import { Injectable } from '@angular/core';
import { IStudent } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl:string = appSetings.apiUrl

  constructor(private http: HttpClient) { }

  getStudentByType(id: number){
    return this.http.get<IStudent[]>(`${this.apiUrl}/api/Student/${id}`)
  }
}
