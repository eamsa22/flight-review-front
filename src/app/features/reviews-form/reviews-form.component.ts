import { Component, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { CommonModule, NgFor } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews-form',
  imports: [
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule, 
    CommonModule],
  templateUrl: './reviews-form.component.html',
  styleUrl: './reviews-form.component.scss'
})

export class ReviewsFormComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  flightForm: FormGroup;
  reviewForm: FormGroup;
  flightData: any = null;
  flightNotFound = false;  
  flightNotFoundMessage: String ="";
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private flightService: FlightService, private reviewService: ReviewService) {
    this.flightForm = this.fb.group({
      flightNumber: ['', Validators.required],
      airline: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }



verifyFlight(stepper: MatStepper): void {
  if (this.flightForm.invalid){
    this.flightForm.markAllAsTouched(); 
    return;
  }

  const { flightNumber, airline, date } = this.flightForm.value;
  const formattedDate = this.formatDate(date);

  this.flightService.getFlight(flightNumber, formattedDate, airline).subscribe({
    next: (flight) => {
      this.flightNotFound = false;
      this.flightData = flight;
      stepper.next();
    },
    error: (err: HttpErrorResponse) => {
      this.flightNotFound = true;
      const isString = typeof err.error === 'string';

      this.flightNotFoundMessage = err.status === 404
        ? (isString ? err.error : err.error?.message || 'Vol introuvable.')
        : 'Erreur au niveau du serveur.';

       this.flightForm.reset();
    }
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.flightData) return;

    const { rating, comment } = this.reviewForm.value;

    const review = {
      rating: Number(rating),
      comment: comment.trim(),
      flight: this.flightData
    };

    this.reviewService.submitReview(review).subscribe({
      next: (res) => {
        console.log('Avis enregistré avec succès !', res);
        this.showNotification('success', 'Avis enregistré avec succès !');
        this.reviewForm.reset();
        this.flightForm.reset();
        this.flightData = null;
        this.stepper.reset();

      },
      error: (err) => {
        console.error('Erreur lors de l’envoi de l’avis', err);
        this.showNotification('error', 'Erreur lors de l’envoi de l’avis. Veuillez réessayer.');
      }
    });
  }

  private showNotification(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = '';
    } else {
      this.errorMessage = message;
      this.successMessage = '';
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000); 
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`; 
  }

}
