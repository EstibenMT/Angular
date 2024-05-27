import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { IStudentTypeValues } from '../../model/studentTypeValues';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StudentType } from '../../enums/student-type';
import { StudentTypeService } from '../../services/student-type.service';




@Component({
  selector: 'app-student-selector-type',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-selector-type.component.html',
  styleUrl: './student-selector-type.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StudentSelectorTypeComponent),
      multi: true
    }
  ]
})
export class StudentSelectorTypeComponent  implements ControlValueAccessor{
  studentTypes = Object.values(StudentType);
  @Output() typeSelected = new EventEmitter<number>();

  @Input() selectedStudentType: number | null = null; // Valor inicial
  currentType: string | null = null; // Nombre del tipo de estudiante

  constructor(private studentTypeService: StudentTypeService) { }

  ngOnChanges() {
    if (this.selectedStudentType !== null) {
      this.currentType = Object.keys(IStudentTypeValues).find(key => IStudentTypeValues[key] === this.selectedStudentType) || null;
    }
  }  

  onSelect(studentType: string) {
    const numericValue = IStudentTypeValues[studentType];
    this.studentTypeService.setSelectedType(numericValue);
    this.typeSelected.emit(numericValue);
    
  }

  value: any;
  onChange: any = () => {};
  onTouch: any = () => {};
  isDisabled: boolean = false;

  writeValue(value: any): void {
    this.selectedStudentType = value;
    this.currentType = Object.keys(IStudentTypeValues).find(key => IStudentTypeValues[key] === value) || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
