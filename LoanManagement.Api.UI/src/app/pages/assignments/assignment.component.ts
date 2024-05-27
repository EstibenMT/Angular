import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  Input,
  OnInit
  } from '@angular/core';
import { DeviceAutocompleteComponent } from '../../components/device-autocomplete/device-autocomplete.component';
import { IAssignment } from '../../model/assignment';
import { IStudentTypeValues } from '../../model/studentTypeValues';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { StudentAutocompleteComponent } from '../../components/student-autocomplete/student-autocomplete.component';
import { StudentSelectorTypeComponent } from '../../components/student-selector-type/student-selector-type.component';
import { StudentTypeService } from '../../services/student-type.service';
import { Subscriber } from 'rxjs';


import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [
    StudentSelectorTypeComponent,
    DeviceAutocompleteComponent,
    StudentAutocompleteComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCardModule,
    CommonModule,
    AsyncPipe,
    FormsModule,
    MatButtonToggleModule,
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css',
})

export class AssignmentComponent implements OnInit{
  @Input('id') idAsigment!:number;
  assignment: IAssignment | null = null;
  assignmentForm: FormGroup;
  buttonDisabled = true;
  selectedStudentType: number | null = null; // Valor inicial
  

  constructor(
    private fb: FormBuilder,
    private studentTypeService: StudentTypeService,
    private assignmentService: AssignmentService,
    private router: Router
    
  ) {
    this.assignmentForm = this.fb.group({
      //assignmentId: [''],
      studentType: ['', Validators.required],
      student: ['', Validators.required],
      device: ['', Validators.required],
      
    });
  }

  ngOnInit() {
    if (this.idAsigment && this.idAsigment !== 0) {
      this.assignmentService.getAssignmentById(this.idAsigment).subscribe({
        next: (data) => {
          this.assignment = data.data;
          this.selectedStudentType = this.assignment?.selecType || null;
          this.assignmentForm.patchValue({
            studentType: this.selectedStudentType,
            student: this.assignment?.student,
            device: this.assignment?.device,
          });
        },
        error: (error) => {
          console.error('Error retrieving assignment details:', error);
        }
      });
    }

    this.studentTypeService.getSelectedType().subscribe(type => {
      this.assignmentForm.patchValue({ studentType: type });
    });

    this.assignmentForm.valueChanges.subscribe(() => {
      this.buttonDisabled = this.areFieldsEmpty() || this.assignmentForm.invalid;
    });
  
  } 

  areFieldsEmpty(): boolean {
    const formValues = this.assignmentForm.value;
    return !formValues.studentType || !formValues.student || 
          !formValues.device || !formValues.student.name || !formValues.device.serial;
  }

  onSubmit() {
    if (this.assignmentForm.valid) {
      const formValues = this.assignmentForm.value;

      const assignment: IAssignment = {
        selecType: formValues.studentType,
        id: +this.idAsigment,
        studentId: formValues.student?.id,
        deviceId: formValues.device?.id,
        loanDate: null,
        deadline: null,
        device: formValues.device,
        student: formValues.student
      };

      if(assignment.id !== 0){
        if(confirm(`Está seguro de modificar la asignación.`)){
          this.assignmentService.updateAssignment(+this.idAsigment,assignment).subscribe({
            next: (response) => {
              if(response.status == 200){
                console.log('Assignment saved:', response);
                this.router.navigate(['/']);
              }else{
                alert(response.message);
              }            
            },
            error: (error) => {
              console.error('Error saving assignment:', error);
            }
          })
        }
      }else{
        this.assignmentService.createAssignment(assignment).subscribe({
          next: (response) => {
            if(response.status == 200){
              console.log('Assignment saved:', response);
              this.router.navigate(['/']);
            }else{
              alert(response.message);
            }            
          },
          error: (error) => {
            console.error('Error saving assignment:', error);
          }
        });
      }
    }
  }
  goBack(){
    this.router.navigate(['/']);
  }
}
