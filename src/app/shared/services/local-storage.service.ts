import { StorageService } from 'ngx-webstorage-service';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private STORAGE_KEY = 'HH_CT_ContactDataLocal';
  private _subject = new BehaviorSubject<number>(0);
  dataSubject$: Observable<number> = this._subject.asObservable();

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) { }

  public removeStorage() {
    this._subject.next(0);
    return this.storage.remove(this.STORAGE_KEY);
  }

}
