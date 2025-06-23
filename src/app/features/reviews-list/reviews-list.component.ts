import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../model/Review';

@Component({
  selector: 'app-reviews-list',
  imports: [MatPaginator, MatPaginatorModule,MatIconModule,MatTableModule, CommonModule, MatFormFieldModule,MatSort, MatSortModule,  MatInputModule, MatDatepickerModule ,ReactiveFormsModule , MatNativeDateModule ],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  cols = [
    { name: 'flightNumber', field: 'flight', subfield: 'flightNumber', header: 'N° du Vol', filterType: 'text' },
    { name: 'airline', field: 'flight', subfield: 'airline', header: 'Compagnie', filterType: 'text' },
    { name: 'flightDate', field: 'flight', subfield: 'date', header: 'Date du vol', filterType: 'date' },
    { name: 'rating', field: 'rating', header: 'Note', filterType: 'number' },
    { name: 'comment', field: 'comment', header: 'Commentaire', filterType: 'text' },
    { name: 'submittedAt', field: 'submittedAt', header: 'Date avis', filterType: 'date' },
  ];

  displayedColumns = this.cols.map(col => col.name);
  dataSource = new MatTableDataSource<Review>([]);
  
  filterControls: { [key: string]: FormControl } = {};
  pickerMap: { [key: string]: string } = {};

  constructor(private reviewService: ReviewService){}

  ngOnInit() {
    this.loadData();
    this.cols.forEach((col, index) => {
      this.filterControls[col.field] = new FormControl('');
      if (col.filterType === 'date') {
        this.pickerMap[col.field] = `picker${index}`; 
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.dataSource.data = reviews;
      },
      error: (err) => {
        console.error('Erreur de chargement des avis :', err);
        this.dataSource.data = []; 
      }
    });
  }



  applyFilters() {
  }
}