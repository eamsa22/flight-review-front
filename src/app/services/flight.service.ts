import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getFlight(flightNumber: string, date: string, airline: string): Observable<any> {
    const params = new HttpParams()
      .set('flightNumber', flightNumber)
      .set('date', date)
      .set('airline', airline);

    const url = `${this.baseUrl}/flights`;
    console.log('Calling backend URL:', url, params.toString());

    return this.http.get<any>(url, { params });
  }

}
