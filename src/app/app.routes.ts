import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ReviewsFormComponent } from './features/reviews-form/reviews-form.component';
import { ReviewsListComponent } from './features/reviews-list/reviews-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'submit-review', component: ReviewsFormComponent},
    { path: 'view-reviews', component: ReviewsListComponent },
  ];
