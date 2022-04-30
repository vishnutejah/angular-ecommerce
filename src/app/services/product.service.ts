import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl="http://localhost:8080/api/products";
  private categoryUrl="http://localhost:8080/api/product-category";


  constructor(private httpClient:HttpClient) { }

  getProductList(theCategoryId:number):Observable<Product[]>{

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl); 
  }

  getProductListPaginate(thePage:number,
                        thePageSize:number,
                        theCategoryId:number):Observable<GetResponseProducts>{

    //need to build URL based on the categoryId, page and page size
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  

  getProductCategories() : Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response=>response._embedded.productCategory)
    );

  }

  searchProducts(theKeyWord: string | null):Observable<Product[]>{

    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getProducts(searchUrl);
  } 

  searchProductsPaginate(thePage:number,
                        thePageSize:number,
                        theKeyWord:string):Observable<GetResponseProducts>{

//need to build URL based on the keyword, page and page size
const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
  +`&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number) : Observable<Product>{
    
    //need to build the url based on 'productid'
    const productUrl=`${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
    
  }

} 
  

interface GetResponseProducts{
  _embedded:{
    products:Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}
