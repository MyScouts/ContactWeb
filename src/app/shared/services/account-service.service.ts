import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
  uploader: any;
  errorUpload: boolean;
  private _subject = new BehaviorSubject<any>([]);
  profileSubject$: Observable<any> = this._subject.asObservable();

  constructor(
    private _http: HttpClient,
  ) { }
  getProfile() {
    return this._http.get<any>(`${environment.apiUrl}api/v1/User/GetProfile`);
  }

}
