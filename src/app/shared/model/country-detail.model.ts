import { StateDetail } from "./state-detail.model";

export class CountryDetail
{
    countryLinkId:number = 0;
    country: string='';
    flagCode: string='';
    states: StateDetail[]=[];
}
