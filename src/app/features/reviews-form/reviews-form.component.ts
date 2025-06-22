import { Component } from '@angular/core';
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
  flightForm: FormGroup;
  reviewForm: FormGroup;
  flightNotFound = false;  
  flightNotFoundMessage: String ="";

  constructor(private fb: FormBuilder, private flightService: FlightService) {
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
    next: () => {
      this.flightNotFound = false;
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
    const review = {
      ...this.flightForm.value,
      ...this.reviewForm.value
    };
    console.log('Review submitted:', review);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }
}
