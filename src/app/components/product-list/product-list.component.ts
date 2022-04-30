import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[]=[];
  currentCategoryId:number=1;
  currentCategoryName: string='';
  searchMode:boolean=false;
  previousCategoryId: number=1;
  previousKeyword:string;


  //new properties for pagination
  thePageSize:number=5;
  thePageNumber=1;
  theTotalElements:number=0;

  constructor(private productService:ProductService,
              private cartService:CartService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
    
  }

  listProducts(){

    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleListProducts(){

    // check if Id param is available
    const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      //get the "id" param String and convert it to number using "+"
      this.currentCategoryId= +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;

    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //check if we have  different category id than previous
    //Note: Angular will reuse the component if it is currently being viewed

    //if we have different category id than previous, then set the pagenumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts(){

    const theKeyWord=this.route.snapshot.paramMap.get('keyword'); 

    //If we have different keyword than the previous one
    //then set the pagenumber to 1

    if(this.previousKeyword!=theKeyWord){
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyWord!;

    //now search for products using that given keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              theKeyWord!)
                                              .subscribe(this.processResult());

  }

  updatePageSize(pageSize:number){
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  addToCart(theProduct:Product){
    console.log(`${theProduct.name}+ ${theProduct.unitPrice}`);

    const theCartItem=new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }

}
