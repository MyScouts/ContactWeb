import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {
  private STORAGE_KEY = 'SW_ALF_Customer';
  private KEY_STORAGE_ADD_CHECKOUT = 'Address_Checkout';
  private KEY_STORAGE_DELIVERY_DATA = 'delivery_Data';
  private _subject = new BehaviorSubject<number>(1);
  profileSubject$: Observable<number> = this._subject.asObservable();

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService

  ) { }

  // subject
  setProfile(item: any) {
    this._subject.next(item);
  }
  // localStorage
  public setStorage(item: any) {
    this.storage.set(this.STORAGE_KEY, item);
    return this.setProfile(2);
  }
  //
  public getStorage() {
    return this.storage.get(this.STORAGE_KEY);
  }
  //
  public removeStorage() {
    this.storage.remove(this.STORAGE_KEY);
    this.storage.remove(this.KEY_STORAGE_ADD_CHECKOUT);
    this.storage.remove(this.KEY_STORAGE_DELIVERY_DATA);
    return this.setProfile(2);
  }

}
