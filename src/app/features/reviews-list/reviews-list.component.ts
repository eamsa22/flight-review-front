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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-reviews-list',
  imports: [MatTooltipModule,MatPaginator, MatPaginatorModule,MatIconModule,MatTableModule, CommonModule, MatFormFieldModule,MatSort, MatSortModule,  MatInputModule, MatDatepickerModule ,ReactiveFormsModule , MatNativeDateModule ],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cols = [
    { name: 'flightNumber', field: 'flight', subfield: 'flightNumber', header: 'N° du Vol', filterType: 'text' },
    { name: 'airline', field: 'flight', subfield: 'airline', header: 'Compagnie', filterType: 'text' },
    { name: 'flightDate', field: 'flight', subfield: 'date', header: 'Date du vol', filterType: 'between' },
    { name: 'rating', field: 'rating', header: 'Note', filterType: 'number' },
    { name: 'comment', field: 'comment', header: 'Commentaire', filterType: 'text' },
    { name: 'submittedAt', field: 'submittedAt', header: 'Date avis', filterType: 'between' },
  ];

  displayedColumns: string[] = [...this.cols.map(col => col.name), 'actions'];

  dataSource = new MatTableDataSource<Review>([]);
  
  filterControls: { [key: string]: FormControl } = {};

  
  constructor(private reviewService: ReviewService,private dialog: MatDialog){}

  ngOnInit() {
  this.cols.forEach((col, index) => {
    const control = new FormControl('');
    this.filterControls[col.name] = control;

    control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());
  });

  this.loadData(); 
}


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => {
      this.applyFilters(); 
    });

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
    const filters: any = {};

    this.cols.forEach(col => {
      const value = this.filterControls[col.name].value;

      if (!value) return;

      switch (col.filterType) {
        case 'text':
          if (col.name === 'airline') filters.airline = value;
          if (col.name === 'flightNumber') filters.flightNumber = value;
          if (col.name === 'comment') filters.keyword = value;
          break;

        case 'number':
          if (col.name === 'rating') filters.rating = value;
          break;

        case 'between':
          const date: Date = value;
          const formatted = this.formatDate(date);

          if (col.name === 'flightDate') {
            filters.flightStartDate = formatted;
            filters.flightEndDate = formatted;
          }

          if (col.name === 'submittedAt') {
            const date: Date = this.filterControls[col.name].value;
            if (date) {
              filters.submittedAfter = this.formatDateTime(date, 'start');
              filters.submittedBefore = this.formatDateTime(date, 'end');
            }
          }

          break;
      }
    });

    let sortParam = '';

    if (this.sort.active) {
      const dir = this.sort.direction || 'asc';

      let fieldName = this.sort.active;

      if (fieldName === 'flightDate') {
        fieldName = 'flight.date';
      } else if (['flightNumber', 'airline'].includes(fieldName)) {
        fieldName = `flight.${fieldName}`;
      }

      sortParam = `${fieldName},${dir}`;
    }


    this.reviewService.getFilteredReviews(filters, sortParam).subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => {
        console.error('Erreur recherche :', err);
        this.dataSource.data = [];
      }
    });

  }

  resetFilters() {
    Object.keys(this.filterControls).forEach(key => {
      this.filterControls[key].setValue('');
    });
  }

  viewComment(row: Review) {
    this.dialog.open(CommentDialogComponent, {
      data: {
        comment: row.comment,
        response: row.response ?? null
      },
      width: '500px'
    });
  }


  private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); 
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`; 
  }
  
  private formatDateTime(date: Date, boundary: 'start' | 'end'): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const time = boundary === 'start' ? '00:00:00' : '23:59:59';
    return `${year}-${month}-${day}T${time}`;
  }

}
