import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService
{
    isUpdate = new Subject<boolean>();
    isUpdateing: boolean = true;

    constructor() { }

    setUpdate(update: boolean)
    {
        this.isUpdateing = update;        
        this.isUpdate.next(update);
    }

    getUpdate(): Observable<boolean>
    {
        return this.isUpdate.asObservable();
    }

    getUpdateing(): boolean
    {
        return this.isUpdateing;
    }
}
