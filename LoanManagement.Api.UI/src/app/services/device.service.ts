import { appSetings } from '../settings/appsetings';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../model/apiResponse';
import { IDevice } from '../model/device';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl:string = appSetings.apiUrl

  constructor(private http: HttpClient) { }

  getDeviceByType(id: number){
    return this.http.get<IDevice[]>(`${this.apiUrl}/api/Device/ForType/${id}`)
  }
}
