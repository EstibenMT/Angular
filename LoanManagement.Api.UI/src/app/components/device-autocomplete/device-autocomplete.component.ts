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
import { DeviceService } from '../../services/device.service';
import { filter, map, startWith } from 'rxjs/operators';
import { IDevice } from '../../model/device';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { StudentTypeService } from '../../services/student-type.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-device-autocomplete',
  standalone: true,
  imports: [
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeviceAutocompleteComponent),
      multi: true
    }
  ],
  templateUrl: './device-autocomplete.component.html',
  styleUrl: './device-autocomplete.component.css'
})
export class DeviceAutocompleteComponent implements OnInit, ControlValueAccessor {
  myControl = new FormControl<string | any>('');
  filteredOptions?: Observable<any[]>;
  selectedType: number = 0;

  constructor(
    private deviceService: DeviceService,
    private studentTypeService: StudentTypeService  
  ) { }

  ngOnInit() {
    this.studentTypeService.getSelectedType().subscribe(type => {
      this.myControl.setValue(null);
      this.onChange(null);
      this.selectedType = type;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.serial),
        switchMap(serial => {
          if (typeof serial === 'string') {
            return this._filter(serial);
          } else {
            return of([]); 
          }
        })
      );
    });
  }

  displayFn(device: any): string {
    return device && device.serial ? `${device.serial} ${device.brand}` : '';
  }

  private _filter(serial: string): Observable<any[]> {
    const filterValue = serial.toLowerCase();
    return this.deviceService.getDeviceByType(this.selectedType).pipe(
      map(devices =>
        devices.filter((device: any) =>       
          device.serial.toLowerCase().includes(filterValue)
        )
      )
    );
  }
  
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const device = event.option.value;
    this.onChange(device);
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    if (!inputValue) {
      this.filteredOptions = this.deviceService.getDeviceByType(this.selectedType);
      this.myControl.setValue(null);
      this.onChange(null);
    }
  }

  // ControlValueAccessor implementation
  onChange = (device: any) => {};
  onTouched = () => {};

  writeValue(device: any): void {
    this.myControl.setValue(device);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
