import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudServiceService } from '../crud-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../Modal/Interface/Category';
import { Subcategory } from '../Modal/Interface/Subcategory';
import { Questions } from '../Modal/Interface/Questions';
import { Content } from '../Modal/Interface/Content';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { DailogBoxSubcategoryComponent } from '../dailog-box-subcategory/dailog-box-subcategory.component';
import { MatDialog } from '@angular/material/dialog';
import { DailogBoxQuestionsComponent } from '../dailog-box-questions/dailog-box-questions.component';
import { DailogBoxContentComponent } from '../dailog-box-content/dailog-box-content.component';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css','../css/sb-admin-2.min.css','../vendor/fontawesome-free/css/all.min.css'],
})
export class CmsComponent implements OnInit {
  currentTab: Number;
  maxCategoryNumber: Number = 1;
  maxSubCategoryNumber: Number = 1;
  maxQuestionNumber: Number = 1;
  maxContentNumber: Number = 1;
  categoryData: Category[] = [];
  subcategoryData: Subcategory[] =[{} as Subcategory];
  questionsData: Questions[] = [];
  contentData: Content[] = [];
  addCategory: Category;
  deleteCategory: Category;
  updateCategory: Category;
  addSubCategory: Subcategory;
  deleteSubCategory: Subcategory;
  updateSubCategory: Subcategory;
  addQuestions: Questions;
  deleteQuestions: Questions;
  updateQuestions: Questions;
  addContents: Content;
  deleteContents: Content;
  updateContents: Content;
  questionsFors: String[] = ['Both', 'Single', 'Couple'];
  categoryDisplayedColumns: string[] = ['category', 'categoryName', 'action'];
  subcategoryDisplayedColumns: string[] = [
    'subcategory',
    'category',
    'subcategoryName',
    'positiveKeyword',
    'negativeKeyword',
    'action',
  ];
  questionsDisplayedColumns: string[] = [
    'questionNo',
    'questions',
    'category',
    'subcategory',
    'questionFor',
    'action',
  ];
  contentDisplayedColumns: string[] = [
    'contentNo',
    'pretext',
    'first',
    'second',
    'third',
    'imageHeight',
    'imageWidth',
    'pageReference',
    'action',
  ];
  
  optionColumn: String[] = ['choice', 'weightage'];
  catno = new FormControl('');
  catname = new FormControl('');
  sideButtons = 'questions';
  UserName = '';

  categorydataSource = new MatTableDataSource<Category>(this.categoryData);
  subcategorydataSource = new MatTableDataSource<Subcategory>(
    this.subcategoryData
  );
  questionsdataSource = new MatTableDataSource<Questions>(this.questionsData);
  contentdataSource = new MatTableDataSource<Content>(this.contentData);

  
  subCatnameFilter = new FormControl('');
  subCatnoFilter = new FormControl('');
  subCatPositiveFilter = new FormControl('');
  subCatNegativeFilter = new FormControl('');
  queNamefilter = new FormControl('');
  queCatnoFilter = new FormControl('');
  queForFilter = new FormControl('');
  contentPretextFilter = new FormControl('');
  contentFirstFilter = new FormControl('');
  contentSecondFilter = new FormControl('');
  contentThirdFilter = new FormControl('');
  contentPageReferenceFilter = new FormControl('');
  catFilter = new FormControl('');
  
  queSubCatnoFilter = new FormControl('');
  SubCatfilterValues = {
    name: '',
    positiveKeyword: '',
    negativeKeyword: '',
    catNo: ''   
  };
  QuefilterValues = {
    questionName: '',
    catNo: '',
    subCatNo: '',
    questionFor: ''   
  };
  ContentfilterValues = {
    pretext: '',
    first: '',
    second:'',
    third: '',
    pageReference: ''   
  };
  filterValues = {};  
  filterSelectObj = [];
  filterbuttonValue = true;
  UserRole = 'user';

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('sort3') sort3: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('paginator4') paginator4: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.currentTab = 0;
    this.setPaginator();
  }

  setPaginator() {
    this.categorydataSource.paginator = this.paginator;
    this.subcategorydataSource.paginator = this.paginator2;
    this.questionsdataSource.paginator = this.paginator3;
    this.contentdataSource.paginator = this.paginator4;
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      this.currentTab = indexNumber;
      switch (indexNumber) {
        case 0:
          !this.categorydataSource.paginator
            ? (this.categorydataSource.paginator = this.paginator)
            : null;
          break;
        case 1:
          !this.subcategorydataSource.paginator
            ? (this.subcategorydataSource.paginator = this.paginator2)
            : null;
          break;
        case 2:
          !this.questionsdataSource.paginator
            ? (this.questionsdataSource.paginator = this.paginator3)
            : null;
      }
    });
  }

  constructor(
    private apiService: CrudServiceService,
    public dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cookieService: CookieService
  ) {
      
    
// Object to create Filter for
this.filterSelectObj = [
  {
    key: 'subcategoryName',
    value: ''
  },
  {
    key: 'positiveKeyword',
    value: ''
  }, {
    key: 'negativeKeyword',
    value: ''
  }
]

  }

  ngOnInit(): void {
    //this.cookieService.set( 'token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjFhNWRjYTk2ZDdlMDAxN2I3NjRmYSIsImlhdCI6MTYxMzU5MDMwMiwiZXhwIjoxNjE2MTgyMzAyfQ.43VKhjN06Bv-7gB2SiJ96Twd4beWID0cTmCPLckHo1k' ); // To Set Cookie
    var cookieValue = this.cookieService.get('token');
    this.UserName = localStorage.getItem('userName');
    this.UserRole = localStorage.getItem('role');
    console.log(cookieValue);
    if(cookieValue == "")
    {
     // this.router.navigate(['login']);
    }
    this.catFilter.valueChanges
    .subscribe(
      name => {
        this.categorydataSource.filter = JSON.stringify({name: name});
      }
    )
    
    this.subCatnameFilter.valueChanges
    .subscribe(
      name => {
        this.SubCatfilterValues.name = name;
        this.subcategorydataSource.filter = JSON.stringify(this.SubCatfilterValues);
      }
    )
    
    this.subCatPositiveFilter.valueChanges
    .subscribe(
      positiveKeyword => {
        this.SubCatfilterValues.positiveKeyword = positiveKeyword;
        this.subcategorydataSource.filter = JSON.stringify(this.SubCatfilterValues);
      }
    )

    this.subCatNegativeFilter.valueChanges
    .subscribe(
      negativeKeyword => {
        this.SubCatfilterValues.negativeKeyword = negativeKeyword;
        this.subcategorydataSource.filter = JSON.stringify(this.SubCatfilterValues);
      }
    )
  
    this.subCatnoFilter.valueChanges
    .subscribe(
      catNo => {
        this.SubCatfilterValues.catNo = catNo;
        this.subcategorydataSource.filter = JSON.stringify(this.SubCatfilterValues);
      }
    )

    this.queNamefilter.valueChanges
    .subscribe(
      questionName => {
        this.QuefilterValues.questionName = questionName;
        this.questionsdataSource.filter = JSON.stringify(this.QuefilterValues);
      }
    )

    this.queCatnoFilter.valueChanges
    .subscribe(
      catNo => {
        this.QuefilterValues.catNo = catNo;
        this.questionsdataSource.filter = JSON.stringify(this.QuefilterValues);
      }
    )

    this.queSubCatnoFilter.valueChanges
    .subscribe(
      subCatNo => {
        this.QuefilterValues.subCatNo = subCatNo;
        this.questionsdataSource.filter = JSON.stringify(this.QuefilterValues);
      }
    )

    this.queForFilter.valueChanges
    .subscribe(
      questionFor => {
        this.QuefilterValues.questionFor = questionFor;
        this.questionsdataSource.filter = JSON.stringify(this.QuefilterValues);
      }
    )

    this.contentPretextFilter.valueChanges
    .subscribe(
      pretext => {
        this.ContentfilterValues.pretext = pretext;
        this.contentdataSource.filter = JSON.stringify(this.ContentfilterValues);
      }
    )

    this.contentFirstFilter.valueChanges
    .subscribe(
      first => {
        this.ContentfilterValues.first = first;
        this.contentdataSource.filter = JSON.stringify(this.ContentfilterValues);
      }
    )

    this.contentSecondFilter.valueChanges
    .subscribe(
      second => {
        this.ContentfilterValues.second = second;
        this.contentdataSource.filter = JSON.stringify(this.ContentfilterValues);
      }
    )

    this.contentThirdFilter.valueChanges
    .subscribe(
      third => {
        this.ContentfilterValues.third = third;
        this.contentdataSource.filter = JSON.stringify(this.ContentfilterValues);
      }
    )

    this.contentPageReferenceFilter.valueChanges
    .subscribe(
      pageReference => {
        this.ContentfilterValues.pageReference = pageReference;
        this.contentdataSource.filter = JSON.stringify(this.ContentfilterValues);
      }
    )


    this.setCategoryTable();
    this.setSubCategoryTable();
    this.setQueCategoryTable();
    this.setContentTable();
    
    
  }

  createQuestionFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.questions.toLowerCase().indexOf(searchTerms.questionName) !== -1
          && ((data.category == undefined) ? ('').toLowerCase().indexOf(searchTerms.catNo) !== -1  : data.category.toString().toLowerCase().indexOf(searchTerms.catNo) !== -1 ) 
          && ((data.subcategory == undefined) ? ('').toLowerCase().indexOf(searchTerms.subCatNo) !== -1  : data.subcategory.toString().toLowerCase().indexOf(searchTerms.subCatNo) !== -1 ) 
          && ((data.questionFor == undefined) ? ('').toLowerCase().indexOf(searchTerms.questionFor) !== -1  : data.questionFor.toString().toLowerCase().indexOf(searchTerms.questionFor) !== -1 ) 
          //&& data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1
         //&& data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1
        // && data.pet.toLowerCase().indexOf(searchTerms.pet) !== -1;
    }
    return filterFunction;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.subcategoryName.toLowerCase().indexOf(searchTerms.name) !== -1
          && ((data.positiveKeyword == undefined) ? ('').toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1  : data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1 ) 
          && ((data.negativeKeyword == undefined) ? ('').toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1  : data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1 ) 
          && ((data.category == undefined) ? ('').toLowerCase().indexOf(searchTerms.catNo) !== -1  : data.category.toString().toLowerCase().indexOf(searchTerms.catNo) !== -1 ) 
          //&& data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1
         //&& data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1
        // && data.pet.toLowerCase().indexOf(searchTerms.pet) !== -1;
    }
    return filterFunction;
  }

  
  createCatFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.categoryName.toLowerCase().indexOf(searchTerms.name) !== -1
         // && ((data.positiveKeyword == undefined) ? ('').toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1  : data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1 ) 
          //&& ((data.negativeKeyword == undefined) ? ('').toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1  : data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1 ) 
          //&& ((data.category == undefined) ? ('').toLowerCase().indexOf(searchTerms.catNo) !== -1  : data.category.toString().toLowerCase().indexOf(searchTerms.catNo) !== -1 ) 
          //&& data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1
         //&& data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1
        // && data.pet.toLowerCase().indexOf(searchTerms.pet) !== -1;
    }
    return filterFunction;
  }

  createContentFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return ((data.pretext == undefined) ? ('').toLowerCase().indexOf(searchTerms.pretext) !== -1  : data.pretext.toLowerCase().indexOf(searchTerms.pretext) !== -1 ) 
          && ((data.first == undefined) ? ('').toLowerCase().indexOf(searchTerms.first) !== -1  : data.first.toLowerCase().indexOf(searchTerms.first) !== -1 ) 
          && ((data.second == undefined) ? ('').toLowerCase().indexOf(searchTerms.second) !== -1  : data.second.toLowerCase().indexOf(searchTerms.second) !== -1 ) 
          && ((data.third == undefined) ? ('').toLowerCase().indexOf(searchTerms.third) !== -1  : data.third.toLowerCase().indexOf(searchTerms.third) !== -1 ) 
          && ((data.pageReference == undefined) ? ('').toLowerCase().indexOf(searchTerms.pageReference) !== -1  : data.pageReference.toLowerCase().indexOf(searchTerms.pageReference) !== -1 ) 
          //&& data.positiveKeyword.toLowerCase().indexOf(searchTerms.positiveKeyword) !== -1
         //&& data.negativeKeyword.toLowerCase().indexOf(searchTerms.negativeKeyword) !== -1
        // && data.pet.toLowerCase().indexOf(searchTerms.pet) !== -1;
    }
    return filterFunction;
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DailogBoxComponent, {
      width: '250px',
      data: obj,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  openSubDialog(action, obj) {
    obj.action = action;
    const dialogSubRef = this.dialog.open(DailogBoxSubcategoryComponent, {
      width: '250px',
      data: obj,
      disableClose: true,
    });

    dialogSubRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addSubRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateSubRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteSubRowData(result.data);
      }
    });
  }

  openQueDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DailogBoxQuestionsComponent, {
      width: '800px',
      data: obj,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addQueRowData(result.data, result.avatar);
      } else if (result.event == 'Update') {
        this.updateQueRowData(result.data, result.avatar);
      } else if (result.event == 'Delete') {
        this.deleteQueRowData(result.data);
      }
    });
  }

  openContentDialog(action, obj) {
    obj.action = action;
    const dialogSubRef = this.dialog.open(DailogBoxContentComponent, {
      width: '700px',
      data: obj,
      disableClose: true,
    });

    dialogSubRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addContentRowData(result.data, result.avatar);
      } else if (result.event == 'Update') {
        this.updateContentRowData(result.data, result.avatar);
      }
    });
  }

  viewQuestion(row_obj) {
    console.log('View Question ' + row_obj._id);
    window.open('/questions/' + row_obj._id);
    //this.router.navigate(['/questions', row_obj._id]);
  }

  addRowData(row_obj) {
    console.log('ADD');
    console.log(row_obj);
    this.addCategory = {} as Category;
    this.addCategory.category = row_obj.category;
    this.addCategory.categoryName = row_obj.categoryName;
    console.log(this.addCategory);
    this.apiService.submitCategory(this.addCategory).subscribe((result) => {
      var Output = result['data'];
      console.log(Output);
      this.setCategoryTable();
    });
  }
  updateRowData(row_obj) {
    console.log('UPDATE');
    console.log(row_obj);
    this.updateCategory = {} as Category;
    this.updateCategory._id = row_obj._id;
    this.updateCategory.category = row_obj.category;
    this.updateCategory.categoryName = row_obj.categoryName;
    console.log(this.updateCategory);
    this.apiService.updateCategory(this.updateCategory).subscribe((result) => {
      var Output = result['data'];
      console.log(Output);
      this.setCategoryTable();
    });
  }
  deleteRowData(row_obj) {
    console.log('DELETE');
    console.log(row_obj);
    this.deleteCategory = {} as Category;
    this.deleteCategory._id = row_obj._id;
    this.deleteCategory.category = row_obj.category;
    this.deleteCategory.categoryName = row_obj.categoryName;
    this.apiService.deleteCategory(this.deleteCategory).subscribe((data) => {
      console.log(data);
      this.setCategoryTable();
    });
  }

  addSubRowData(row_obj) {
    console.log('ADD');
    console.log(row_obj);
    this.addSubCategory = {} as Subcategory;
    this.addSubCategory.category = row_obj.category;
    this.addSubCategory.subcategory = row_obj.subcategory;
    this.addSubCategory.subcategoryName = row_obj.subcategoryName;
    this.addSubCategory.positiveKeyword = row_obj.positiveKeyword;
    this.addSubCategory.negativeKeyword = row_obj.negativeKeyword;
    console.log(this.addSubCategory);
    this.apiService
      .submitSubCategory(this.addSubCategory)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setSubCategoryTable();
      });
  }
  updateSubRowData(row_obj) {
    console.log('UPDATE');
    console.log(row_obj);
    this.updateSubCategory = {} as Subcategory;
    this.updateSubCategory._id = row_obj._id;
    this.updateSubCategory.category = row_obj.category;
    this.updateSubCategory.subcategory = row_obj.subcategory;
    this.updateSubCategory.subcategoryName = row_obj.subcategoryName;
    this.updateSubCategory.positiveKeyword = row_obj.positiveKeyword;
    this.updateSubCategory.negativeKeyword = row_obj.negativeKeyword;
    console.log(this.updateSubCategory);
    this.apiService
      .updateSubCategory(this.updateSubCategory)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setSubCategoryTable();
      });
  }
  deleteSubRowData(row_obj) {
    console.log('DELETE');
    console.log(row_obj);
    this.deleteSubCategory = {} as Subcategory;
    this.deleteSubCategory._id = row_obj._id;
    this.deleteSubCategory.category = row_obj.category;
    this.deleteSubCategory.subcategory = row_obj.subcategory;
    this.deleteSubCategory.subcategoryName = row_obj.subcategoryName;
    console.log(this.deleteSubCategory);
    this.apiService
      .deleteSubCategory(this.deleteSubCategory)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setSubCategoryTable();
      });
  }

  addQueRowData(row_obj, avatar) {
    console.log('ADD');
    console.log(row_obj);
    this.addQuestions = {} as Questions;
    this.addQuestions._id = row_obj._id;
    this.addQuestions.questionNo = row_obj.questionNo;
    this.addQuestions.alias = row_obj.alias;
    this.addQuestions.answers = row_obj.answers;
    this.addQuestions.questionFor = row_obj.questionFor;
    this.addQuestions.questions = row_obj.questions;
    this.addQuestions.category = row_obj.category;
    this.addQuestions.subcategory = row_obj.subcategory;
    this.addQuestions.imageURL = row_obj.imageURL;
    this.addQuestions.options = row_obj.options;
    this.addQuestions.criteria = row_obj.criteria;
    this.addQuestions.positiveKeyword = row_obj.positiveKeyword;
    this.addQuestions.negativeKeyword = row_obj.negativeKeyword;

    console.log(this.addQuestions);
    this.apiService
      .submitQuestions(this.addQuestions, avatar)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setQueCategoryTable();
      });
  }
  updateQueRowData(row_obj, avatar) {
    console.log('UPDATE');
    console.log(row_obj);
    this.updateQuestions = {} as Questions;
    this.updateQuestions._id = row_obj._id;
    this.updateQuestions.questionNo = row_obj.questionNo;
    this.updateQuestions.alias = row_obj.alias;
    this.updateQuestions.answers = row_obj.answers;
    this.updateQuestions.questionFor = row_obj.questionFor;
    this.updateQuestions.questions = row_obj.questions;
    this.updateQuestions.category = row_obj.category;
    this.updateQuestions.subcategory = row_obj.subcategory;
    this.updateQuestions.imageURL = row_obj.imageURL;
    this.updateQuestions.options = row_obj.options;
    this.updateQuestions.criteria = row_obj.criteria;
    this.updateQuestions.positiveKeyword = row_obj.positiveKeyword;
    this.updateQuestions.negativeKeyword = row_obj.negativeKeyword;

    console.log(this.updateQuestions);
    this.apiService
      .updateQuestions(this.updateQuestions, avatar)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setQueCategoryTable();
      });
  }
  deleteQueRowData(row_obj) {
    console.log('DELETE');
    console.log(row_obj);
    this.deleteQuestions = {} as Questions;
    this.deleteQuestions._id = row_obj._id;
    console.log(this.deleteQuestions);
    this.apiService
      .deleteQuestions(this.deleteQuestions)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setQueCategoryTable();
      });
  }

  addContentRowData(row_obj, avatar) {
    console.log('ADD');
    console.log(row_obj);
    this.addContents = {} as Content;
    this.addContents.contentNo = row_obj.contentNo;
    this.addContents.pageReference = row_obj.pageReference;
    this.addContents.first = row_obj.first;
    this.addContents.second = row_obj.second;
    this.addContents.third = row_obj.third;
    this.addContents.pretext = row_obj.pretext;
    this.addContents.imageURL = row_obj.imageURL;
    this.addContents.imageHeight = row_obj.imageHeight;
    this.addContents.imageWidth = row_obj.imageWidth;

    this.apiService
      .submitContents(this.addContents, avatar)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setContentTable();
      });
  }
  updateContentRowData(row_obj, avatar) {
    console.log('UPDATE');
    console.log(row_obj);
    this.updateContents = {} as Content;
    this.updateContents.contentNo = row_obj.contentNo;
    this.updateContents.pageReference = row_obj.pageReference;
    this.updateContents._id = row_obj._id;
    this.updateContents.first = row_obj.first;
    this.updateContents.second = row_obj.second;
    this.updateContents.third = row_obj.third;
    this.updateContents.pretext = row_obj.pretext;
    this.updateContents.imageURL = row_obj.imageURL;
    this.updateContents.imageHeight = row_obj.imageHeight;
    this.updateContents.imageWidth = row_obj.imageWidth;

    this.apiService
      .updateContents(this.updateContents, avatar)
      .subscribe((result) => {
        var Output = result['data'];
        console.log(Output);
        this.setContentTable();
      });
  }

  submitCategory() {
    console.log('submit category called');
    this.addCategory = {} as Category;
    this.addCategory.category = this.catno.value;
    this.addCategory.categoryName = this.catname.value;
    this.apiService.submitCategory(this.addCategory).subscribe((result) => {
      var Output = result['data'];

      this.setCategoryTable();
    });
  }

  setCategoryTable() {
    this.apiService.getCategory().subscribe((result) => {
      this.categoryData = result['data'];
      this.categorydataSource = new MatTableDataSource<Category>(
        this.categoryData
      );
      
      this.categorydataSource.filterPredicate = this.createCatFilter();

      this._setDataSource(this.currentTab);
      this.categorydataSource.sort = this.sort;
      if (this.categoryData.length > 0) {
        this.maxCategoryNumber =
          this.categoryData[this.categoryData.length - 1].category + 1;
      }
    });
  }
  setSubCategoryTable() {
    this.apiService.getSubcategory().subscribe((result) => {
      this.subcategoryData = result['data'];
      
      this.subcategorydataSource = new MatTableDataSource<Subcategory>(
        this.subcategoryData
      );

      this.subcategorydataSource.filterPredicate = this.createFilter();
   
         
      this._setDataSource(this.currentTab);
      this.subcategorydataSource.sort = this.sort1;
      if (this.subcategoryData.length > 0) {
        this.maxSubCategoryNumber =
          this.subcategoryData[this.subcategoryData.length - 1].subcategory + 1;
      }
    });
  }
  setQueCategoryTable() {
    this.apiService.getQuestions().subscribe((result) => {
      this.questionsData = result['data'];
      this.questionsdataSource = new MatTableDataSource<Questions>(
        this.questionsData
      );

      this.questionsdataSource.filterPredicate = this.createQuestionFilter();
   
      this._setDataSource(this.currentTab);
      this.questionsdataSource.sort = this.sort2;
      if (this.questionsData.length > 0) {
        this.maxQuestionNumber =
          this.questionsData[this.questionsData.length - 1].questionNo + 1;
      }
    });
  }

  setContentTable() {
    this.apiService.getContenthub().subscribe((result) => {
      this.contentData = result['data'];
      this.contentdataSource = new MatTableDataSource<Content>(
        this.contentData
      );
      if (this.contentData.length > 0) {
        this.maxContentNumber =
          this.contentData[this.contentData.length - 1].contentNo + 1;
      }

      this.contentdataSource.filterPredicate = this.createContentFilter();
   
      this.contentdataSource.sort = this.sort3;

      !this.contentdataSource.paginator
        ? (this.contentdataSource.paginator = this.paginator4)
        : null;
    });
  }

  getdata(data) {
    return new MatTableDataSource<any>(data);
  }

  getCategoryName(data) {
    if(data== undefined)
      return data;
    var categoryName = this.categoryData.filter(
      (item) => item.category == data
    );
    return categoryName[0].categoryName;
  }

  getSubCategoryName(data) {
    var subcategoryName = this.subcategoryData.filter(
      (item) => item.subcategory == data
    );
    return subcategoryName[0].subcategoryName;
  }

  goToMainPage() {
    window.open('/start/');
    //this.router.navigate(['/questions', '']);
  }

  getImageURL(imageURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageURL);
  }

  public doFilterCategory = (value: string) => {
    this.categorydataSource.filter = value.trim().toLocaleLowerCase();
  }

  
  public doFilterSubcategory = (value: string) => {
    //this.subcategorydataSource.filter = value.trim().toLocaleLowerCase();
    // if(value == "")
    // {
    //   this.filterValues["subcategoryName"] = value.trim().toLowerCase()
    //   this.subcategorydataSource.filter = "";
    // }else{
    //   this.filterValues["subcategoryName"] = value.trim().toLowerCase()
    //   this.applyFilter(value,"subcategoryName");
    // }
  }

  
  public doFilterQuestions = (value: string) => {
    this.questionsdataSource.filter = value.trim().toLocaleLowerCase();
  }

  toggleClass(elem: HTMLElement){
    console.log("toggle clicked");
    
    if (elem.className.includes("toggled"))
    {
      console.log(elem.className, 'before');
      elem.className = elem.className.replace('toggled','');
      console.log(elem.className, 'after');

    }
    else{
      console.log(elem.className, 'before');
      elem.className += ' toggled';
      console.log(elem.className, 'after');
    }
    
  }

  
  toggleClassProfile(elem: HTMLElement){
    console.log("profile toggle clicked");
    console.log(elem);
    console.log(elem.children[1].className);
    
    if (elem.className.includes("show"))
    {
      console.log(elem.className, 'before');
      elem.className = elem.className.replace(' show','');
      elem.children[1].className = elem.children[1].className.replace(' show','');
      console.log(elem.className, 'after');

    }
    else{
      console.log(elem.className, 'before');
      elem.className += ' show';
      elem.children[1].className += ' show';
      console.log(elem.className, 'after');
    }
    
  }

  
  logoutPopup(elem: HTMLElement){
    console.log("profile toggle clicked");
    console.log(elem);
    
    if (elem.className.includes("show"))
    {
      console.log(elem.className, 'before');
      elem.className = elem.className.replace(' show','');
      elem.style.display = "none";
      console.log(elem.className, 'after');

    }
    else{
      console.log(elem.className, 'before');
      elem.className += ' show';
      elem.style.display = "block";
      console.log(elem.className, 'after');
    }
    
  }

  logout(){
    this.apiService
    .LogoutUser()
    .subscribe((result) => {
           console.log(result["success"]);
    }    
    );
    this.router.navigate(['login']);
  }

  toggleSideButtons(setPage){
    if(setPage == "questions" ){
      this.sideButtons = 'questions';
      this.setPaginator();
    }
    else{
      this.sideButtons = 'contenthub';
      this.setContentTable();
    }
  }

   // Get Uniqu values from columns to build filter
   getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  // Called on Filter change
  filterChange(filter, event) {
    //let filterValues = {}
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
    this.subcategorydataSource.filter = JSON.stringify(this.filterValues)
  }

  // Custom filter method fot Angular Material Datatable
  createFilter1() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }


  // Reset table filters
  resetFilters() {
    this.filterbuttonValue = !this.filterbuttonValue;
    this.subCatnameFilter.patchValue('');
    this.subCatnoFilter.patchValue('');
    this.subCatPositiveFilter.patchValue('');
    this.subCatNegativeFilter.patchValue('');
    this.queNamefilter.patchValue('');
    this.queCatnoFilter.patchValue('');
    this.queForFilter.patchValue('');
    this.queSubCatnoFilter.patchValue('');
    this.contentFirstFilter.patchValue('');
    this.contentSecondFilter.patchValue('');
    this.contentThirdFilter.patchValue('');
    this.contentPretextFilter.patchValue('');
    this.contentPageReferenceFilter.patchValue('');
    this.catFilter.patchValue('');
    this.subcategorydataSource.filter = "";
    this.questionsdataSource.filter = "";
    this.categorydataSource.filter = "";
    this.contentdataSource.filter = "";
  }

  applyFilter(filterValue: string, key: string) {
    this.filterValues = {
        value: filterValue.trim().toLowerCase(),
        key: key
    };
    this.filterSelectObj.forEach(element => {
      if(element.key == key)
        element.value = filterValue.trim().toLowerCase()
    });

    
  this.subcategorydataSource.filter = JSON.stringify(this.filterSelectObj);
    
    if (this.subcategorydataSource.paginator) {
        this.subcategorydataSource.paginator.firstPage();
    }
}

}
