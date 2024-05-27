import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  inject,
  Input,
  OnInit
  } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
  } from '@angular/forms';
import { IStudent } from '../../model/student';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { StudentTypeService } from '../../services/student-type.service';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-student-autocomplete',
  standalone: true,
  imports: [    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCardModule,
    CommonModule,
    AsyncPipe,
    FormsModule,
    MatButtonToggleModule
  ],
  templateUrl: './student-autocomplete.component.html',
  styleUrl: './student-autocomplete.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StudentAutocompleteComponent),
    multi: true
  }]
})


export class StudentAutocompleteComponent implements OnInit, ControlValueAccessor {
  myControl = new FormControl<string | any>('');
  filteredOptions?: Observable<any[]>;
  selectedType: number = 0;

  constructor(
    private studentService: StudentService,
    private studentTypeService: StudentTypeService
  ) { }

  ngOnInit() {
    this.studentTypeService.getSelectedType().subscribe(type => {
      this.myControl.setValue('null');
      this.onChange(null);
      this.selectedType = type;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.identificationCard),
        switchMap(identificationCard => {
          if (typeof identificationCard === 'string') {
            return this._filter(identificationCard);
          } else {
            return of([]); // Si identificationCard no es un string, devolvemos un arreglo vacío
          }
        })
      );
    });
  }

  displayFn(student: any): string {
    return student && student.identificationCard ? `${student.identificationCard} ${student.name} ${student.lastName}` : '';
  }

  private _filter(identificationCard: string): Observable<any[]> {
    const filterValue = identificationCard.toLowerCase();
    return this.studentService.getStudentByType(this.selectedType).pipe(
      map(students =>
        students.filter((student: any) =>
          student.identificationCard.toLowerCase().includes(filterValue) ?student.identificationCard.toLowerCase().includes(filterValue) : null
        )
      )
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const student = event.option.value;
    this.onChange(student);
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    if (!inputValue) {
      this.filteredOptions = this.studentService.getStudentByType(this.selectedType);
      this.myControl.setValue(null);
      this.onChange(null);
    }
  }

  // ControlValueAccessor implementation
  onChange = (student: any) => {};
  onTouched = () => {};

  writeValue(student: any): void {
    this.myControl.setValue(student);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
