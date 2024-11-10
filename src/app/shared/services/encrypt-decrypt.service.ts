import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryList } from '../model/category-list.model';
import { CountryList } from '../model/country-list.model';
import { City } from '../model/city.model';

@Injectable({
    providedIn: 'root'
})
export class EncryptDecryptService
{
    encryptedKey:string = '78526587238230947283626562564235232382983203023943499348734863677545346364563';

    constructor() { }

    encryptold(param: string): string
    {
        let encryptedString: string='';

        for (let index = 0; index < param.length; index++) {

            let code:string = param[index].charCodeAt(0).toString();           

            encryptedString += (this.encryptedKey[index+index] + code + this.encryptedKey[index+index+1]);
        }
        return encryptedString;
    }

    encrypt(param: string): string
    {
        let encryptedString: string='';

        for (let index = 0; index < param.length; index++) {

            let code:string = param[index].charCodeAt(0).toString();
            if (code.length === 2)
                code = '0' + code;            

            encryptedString += (this.encryptedKey[index+index] + code + this.encryptedKey[index+index+1]);
        }
        return encryptedString;
    }    

    decrypt(param: string): string
    {
        let decryptString: string='';
        for (let index = 0; index < param.length; index+=5) {
            
            let decrypt = param[index+1];
            decrypt += param[index+2];
            decrypt += param[index+3];

            decryptString += String.fromCharCode(parseInt(decrypt, 10));
        }

        return decryptString;
    }
}
