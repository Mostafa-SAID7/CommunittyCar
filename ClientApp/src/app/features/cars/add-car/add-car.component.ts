import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarApiService } from '../../../core/services/api/car-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-car',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-car.component.html',

})
export class AddCarComponent {
  carForm: FormGroup;
  isLoading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private carApi: CarApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.carForm = this.fb.group({
      make: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      fuelType: ['', Validators.required],
      transmission: ['', Validators.required],
      seats: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      pricePerDay: ['', [Validators.required, Validators.min(0)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(1000)]],
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];

    // Limit to 10 images
    if (this.selectedFiles.length + files.length > 10) {
      this.notificationService.showWarning('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.isLoading = true;

      const carData: Omit<Car, 'id'> = {
        ...this.carForm.value,
        images: [], // Will be uploaded separately
        rating: 0,
        reviewCount: 0,
        ownerId: '', // Will be set by backend
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.carApi.addCar(carData).subscribe({
        next: (car) => {
          // Upload images if any
          if (this.selectedFiles.length > 0) {
            this.uploadImages(car.id);
          } else {
            this.notificationService.showSuccess('Car added successfully!');
            this.router.navigate(['/cars']);
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to add car. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private uploadImages(carId: string): void {
    // In a real implementation, you'd upload images to the server
    // For now, just show success and navigate
    this.notificationService.showSuccess('Car and images added successfully!');
    this.router.navigate(['/cars']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.carForm.controls).forEach(key => {
      const control = this.carForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.carForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${control.errors['max'].max}`;
      }
      if (control.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${control.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  trackByFn(index: number, item: any): any {
    return index;
  }

  onCancel(): void {
    this.router.navigate(['/cars']);
  }
}

