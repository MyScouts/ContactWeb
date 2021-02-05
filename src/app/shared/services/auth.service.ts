import { UniversalStorage } from './../storage/universal.storage';
import { BehaviorSubject } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ProfileStorageService } from './profile-storage.service';
import { AccountServiceService } from './account-service.service';
@Injectable()
export class AuthService {
  private _authToken: string;
  private _authState: BehaviorSubject<boolean>;
  private _interruptedUrl: string;
  private _initialData: string[] = [
    'token', 'interruptedUrl',
  ];

  constructor(
    @Inject(UniversalStorage) private _appStorage: Storage,
    private _http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private _localStorageService: LocalStorageService,
    private _account: AccountServiceService,
    private _router: Router,
    private _profile: ProfileStorageService,
  ) {
    this._authState = new BehaviorSubject(!1);
    this._initialData.forEach((value) => {
      this[value] = this._getStoredItems(value);
    });

  }

  //
  public get interruptedUrl(): string {
    return this._interruptedUrl;
  }
  //
  public set interruptedUrl(url: string) {
    this._interruptedUrl = url;
    if (!url) {
      this._appStorage.removeItem('interruptedUrl');
    } else {
      this._saveValueInCookieStorage('interruptedUrl', url);
    }
  }
  //
  public get token(): string {
    return this._authToken ? this._authToken : '';
  }
  //
  public set token(token: string) {
    this._authToken = token;
    this.changeAuthState = !!token;
  }

  //
  public resetPassword(formValue: { tokenVerify: string, userId: string, newPassword: string }) {

    let data = {
      "tokenVerify": formValue.tokenVerify,
      "userId": formValue.userId,
      "newPassword": formValue.newPassword
    };
    return this._http.post<any>(`${environment.apiUrl}api/v1/User/ResetPassword`, data);
  }

  //
  public register(formValue: any) {



    console.log("formValue request:", formValue);

    let data = {
      "firstName": formValue.firstName,
      "surName": formValue.surName,
      "phoneNumber": formValue.phoneNumber,
      "address": "",
      "gender": formValue.gender,
      "nationality": formValue.nationality,
      "typeReg": formValue.typeReg,
      "code": formValue.otpCode,
      "accountKitId": "",
      "deviceToken": "",
      "deviceId": "",
      "platform": "web-" + formValue.platform,
      "emailAddress": formValue.emailAddress,
      "dateOfBirth": formValue.dateOfBirth,
      "cardNumber": formValue.cardNo,
      "contactNo": formValue.contactNo,
      "cardNo": formValue.cardNo,
      "accountNo": formValue.accountNo,
      "password": formValue.password
    };
    console.log("register request:", data);

    return this._http.post<any>(`${environment.apiUrl}api/v1/User/Register`, data);
  }

  //
  public logIn(formValue: { username: string, password: string, rememberClient: boolean, platform: string }) {
    //Modify data
    let data = {
      "username": formValue.username,
      "password": formValue.password,
      "deviceToken": "",
      "deviceId": "",
      "platform": "web-" + formValue.platform,
      "rememberClient": formValue.rememberClient
    };
    return this._http.post<any>(`${environment.apiUrl}api/v1/User/Login`, data);
  }

  //
  public logOutNotRedirect() {
    this.token = '';
    this._appStorage.clear();
  }

  //
  public logOut() {
    this.token = '';
    this._appStorage.clear();
    this._profile.removeStorage();
    setTimeout(() => {
      this._router.navigate(['/auth', 'login']).then(() => {
        this._profile.removeStorage();
      });
    }, 1000);
  }

  //
  public _checksaveValueInCookieStorage(key: string, value: string): void {
    // For saving auth token in Cookie storage.


    this._saveValueInCookieStorage(key, value);
    this._account.getProfile().subscribe(
      data => {
        console.log('profile01', data);
        if (data.success) {
          let profile = {
            name: data.result.fullname,
            firstName: data.result.firstName,
            surName: data.result.surName,
            avatar: data.result.avatar,
            cardNumber: data.result.cardNumber,
            phoneNumber: data.result.phoneNumber,
            totalPoints: data.result.totalPoints
          }
          this._profile.setStorage(profile);
          this._router.navigate([this.interruptedUrl && this.interruptedUrl.length ? this.interruptedUrl : '/'])
            .then(() => {
              // this.interruptedUrl = '';
            });

        }
      },
      error => {
        console.log("Error from loading profile", error);
        this.logOut();
      });
  }
  //
  private _saveValueInCookieStorage(key: string, value: string): void {
    // For saving auth token in Cookie storage.

    this._appStorage.setItem(key, value);
    if (key === 'token') {
      this.token = value;
    }
  }

  //
  public _setCookieStorage(key: string, value: string): void {
    // For saving auth token in Cookie storage.
    if (key == "useID") {
      this.clearCart(value);
    }
    this._appStorage.setItem(key, value);

  }
  //
  private _getStoredItems(key: string): any {
    return this._appStorage.getItem(key);
  }

  //
  private clearCart(userId: string) {
    console.log('userId', userId);

    const guestId = this.storage.get('guestId');
    console.log('guestId', guestId);
    if (guestId != undefined && guestId != userId) {
      this._localStorageService.removeStorage();
    }
    this.storage.set('guestId', userId);
  }

  //
  public checkCodeActive(phone: string, code: string) {

    return this._http.get<any>(`${environment.apiUrl}api/v1/User/CheckCodeActive?phone=${phone}&code=${code}`);
  }

  //
  public set changeAuthState(newState: boolean) {
    this._authState.next(newState);
  }

  //
  public forgotPassword(formValue: { code: string, phoneNumber: string }) {

    let data = {
      "code": formValue.code,
      "phoneNumber": formValue.phoneNumber
    };
    return this._http.post<any>(`${environment.apiUrl}api/v1/User/ForgotPassword`, data);
  }

  //

  public isAuthenticated(): boolean {
    // This method is required to implement authentication.
    return !!this.token;
  }



}
