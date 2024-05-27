import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentTypeService {
  private selectedTypeSubject = new BehaviorSubject<number>(0);
  selectedType$: Observable<number> = this.selectedTypeSubject.asObservable();

  private selectedStudentSubject = new BehaviorSubject<number | null>(null);
  selectedStudent$: Observable<number | null> = this.selectedStudentSubject.asObservable();

  private selectedDeviceSubject = new BehaviorSubject<number | null>(null);
  selectedDevice$: Observable<number | null> = this.selectedDeviceSubject.asObservable();

  constructor() { }

  setSelectedType(type: number) {
    this.selectedTypeSubject.next(type);
  }

  getSelectedType(): Observable<number> {
    return this.selectedType$;
  }
}
