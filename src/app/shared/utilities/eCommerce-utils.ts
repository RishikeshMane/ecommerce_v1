import { Injectable } from '@angular/core';
import { CategoryList } from '../model/category-list.model';
@Injectable()
export class ECommerceUtils
{
    ///public static HOSTING: string = 'https://localhost:7163/';
    public static HOSTING: string = 'http://10.1.1.185:80/';
    ///public static HOSTING: string = 'http://gogardenbackend-service:80/';
    ///public static HOSTING: string = 'http://gogardenbackend/';

    ///public static FILEHOSTING: string = 'http://localhost:7092/';
    public static FILEHOSTING: string = 'http://10.1.1.185:443/';
    ///public static FILEHOSTING: string = 'http://gogardenfilesystem/';

    public static getUserProductId(): string
    {
        let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    
        let pincode = sessionStorage.getItem('pincode')?.toString() ?? '999999';

        return ECommerceUtils.getProductId(mobileNo, pincode);
    }

    public static getProductId(mobileno: string, pincode: string): string
    {
        let productid: string = '';
        productid = mobileno[0]+mobileno[1]+pincode[4]+pincode[5]+mobileno[8]+mobileno[9]+'-';
        return productid;
    }

    public static getCategoryName(categoryLinkId: number, categories: CategoryList): string
    {
        let categoryName = '';

        categories.category.forEach( category => {
            if (category.categoryLinkId === categoryLinkId){
                categoryName = category.category;
            }
        }
        )

        return categoryName;
    }

    public static getSubCategoryName(categoryLinkId: number, subCategoryLinkId: number, categories: CategoryList): string
    {
        let subCategoryName = '';
        
        categories.category.forEach( category => {

            if (category.categoryLinkId === categoryLinkId)
            {
                let index: number = 0;
                category.subCategoryLinkIds.forEach(linkId => {
                    if (subCategoryLinkId === linkId){
                        subCategoryName = category.subCategories[index];
                    }
                    ++index;
                }
                )
            }
        })
        return subCategoryName;
    }

    public static goesWellWith(categoryId: number, subCategoryId: number, goesWellData: any): string
    {
        let Id = categoryId + '-' + subCategoryId;
        let goesWellWith: string ='';

        for (var goesWell of goesWellData)
        {
            let well: string[] = goesWell.CategoryIdSubcategoryId.split(';');
            if (Id === well[0])
            {
                goesWellWith = well[1];
                break;
            }
        }

        return goesWellWith;
    }

    public static getSearchFiltered(search: string): string
    {
        let searchList: string[]=[];
        let removeList: string[]=['and', 'in', 'the', 'or', 'for', '+'];

        removeList.forEach(word => {
            search = search.replace(word+' ', '');
            search = search.replace(' '+word, '');
            search = search.replace(word+'  ', '');
            search = search.replace('  '+word, '');            
        });

        search=search.trim();
        search = search.replace(' ', ',');
        search = search.replace('  ', ',');
        search = search.replace('   ', ',');
        search = search.replace('    ', ',');
        search = search.replace('     ', ',');
        search = search.replace('      ', ',');
        search = search.replace('       ', ',');

        search = search.replace(' ', ',');
        search = search.replace('  ', ',');
        search = search.replace('   ', ',');
        search = search.replace('    ', ',');
        search = search.replace('     ', ',');
        search = search.replace('      ', ',');
        search = search.replace('       ', ',');
        
        search = search.replace(' ', ',');
        search = search.replace('  ', ',');
        search = search.replace('   ', ',');
        search = search.replace('    ', ',');
        search = search.replace('     ', ',');
        search = search.replace('      ', ',');
        search = search.replace('       ', ',');
        
        search = search.replace(' ', ',');
        search = search.replace('  ', ',');
        search = search.replace('   ', ',');
        search = search.replace('    ', ',');
        search = search.replace('     ', ',');
        search = search.replace('      ', ',');
        search = search.replace('       ', ',');
        
        search = search.replace(' ', ',');
        search = search.replace('  ', ',');
        search = search.replace('   ', ',');
        search = search.replace('    ', ',');
        search = search.replace('     ', ',');
        search = search.replace('      ', ',');
        search = search.replace('       ', ',');           

        let searchIntermediate = search.split(',');

        searchIntermediate.forEach(word => {
            word = word.trim();
            if (word.length > 0)
                searchList.push(word);
        });

        search = '';

        searchList.forEach(word => {
            search += word;
            search += ',';
        });

        return search.substring(0, search.lastIndexOf(','));
    }

    public static getHandlingCharges(): number
    {
        return 25;
    }

    public static getPercentageFees(): number
    {
        return 2;
    }    

    public static getYYYYMMDD(dateTime: string): string
    {
        let date: string = '';

        let dateDDMMYYYY: string[] = dateTime.split(' ')[0].split('-');
        date = dateDDMMYYYY[2] + '-' + dateDDMMYYYY[1] + '-' + dateDDMMYYYY[0];

        return date;
    }
}
