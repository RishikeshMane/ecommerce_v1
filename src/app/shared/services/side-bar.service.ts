import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SideBarService
{
    isExpand = new Subject<boolean>();
    isExpanding: boolean = true;

    constructor() { }

    setExpand(expand: boolean)
    {
        this.isExpanding = expand;        
        this.isExpand.next(expand);
    }

    getExpand(): Observable<boolean>
    {
        return this.isExpand.asObservable();
    }

    getExpanding(): boolean
    {
        return this.isExpanding;
    }
}
