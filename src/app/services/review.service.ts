import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../model/Review';

@Injectable({
  providedIn: 'root'
})

export class ReviewService {
  private baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  public submitReview(review: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, review);
  }

  public getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/all"); 
  }

  public getFilteredReviews(filters: any): Observable<Review[]> {
    const params = new HttpParams({ fromObject: filters });
    console.log(filters)
    return this.http.get<Review[]>(this.baseUrl+"/all", { params });
  }

}