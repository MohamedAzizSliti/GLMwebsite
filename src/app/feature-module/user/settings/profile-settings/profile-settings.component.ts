import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { routes } from '../../../../shared/routes/routes';
import { UserService, User, UpdateProfileRequest } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-profile-settings',
  standalone: false,
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  routes = routes;
  profileForm: FormGroup;
  addressForm: FormGroup;
  user: User | null = null;
  
  // Loading states
  loading = false;
  saving = false;
  uploadingImage = false;
  
  // Error handling
  error: string | null = null;
  successMessage: string | null = null;
  
  // Image handling
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadProgress = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.createProfileForm();
    this.addressForm = this.createAddressForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      profile_image_id: [null]
    });
  }

  private createAddressForm(): FormGroup {
    return this.fb.group({
      address: [''],
      country: [''],
      state: [''],
      city: [''],
      postal_code: ['', [Validators.pattern(/^[0-9]{5}(-[0-9]{4})?$/)]]
    });
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.user = response.data;
            this.populateForm();
          } else {
            this.error = response.message || 'Failed to load profile';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load profile. Please try again.';
          console.error('Error loading profile:', error);
        }
      });
  }

  private populateForm(): void {
    if (this.user) {
      const nameParts = this.user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Handle phone number - combine country_code and phone if they exist
      let phoneNumber = '';
      if (this.user.phone) {
        const phone = typeof this.user.phone === 'number' ? this.user.phone.toString() : this.user.phone;
        phoneNumber = this.user.country_code ? `${this.user.country_code}${phone}` : phone;
      }

      this.profileForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: this.user.email,
        phone: phoneNumber,
        profile_image_id: this.user.profile_image_id
      });

      // Populate address form with primary address
      const primaryAddress = this.user.address?.find(addr => addr.is_default) || this.user.address?.[0];
      if (primaryAddress) {
        this.addressForm.patchValue({
          address: primaryAddress.address || '',
          country: primaryAddress.country || '',
          state: primaryAddress.state || '',
          city: primaryAddress.city || '',
          postal_code: primaryAddress.postal_code || ''
        });
      }

      // Set image preview
      if (this.user.profile_image) {
        this.imagePreview = this.user.profile_image;
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file.';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB.';
        return;
      }

      this.selectedFile = file;
      this.error = null;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = this.user?.profile_image || null;
    this.profileForm.patchValue({ profile_image_id: null });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private async uploadImage(): Promise<number | null> {
    if (!this.selectedFile) return null;

    this.uploadingImage = true;
    this.uploadProgress = 0;

    try {
      const response = await this.userService.uploadProfileImage(this.selectedFile).toPromise();
      
      if (response?.success && response.data) {
        this.uploadingImage = false;
        this.uploadProgress = 100;
        return response.data.id;
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      this.uploadingImage = false;
      this.uploadProgress = 0;
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;

    try {
      let profileImageId = this.profileForm.get('profile_image_id')?.value;

      // Upload image if selected
      if (this.selectedFile) {
        profileImageId = await this.uploadImage();
      }

      // Prepare profile data
      const formData = this.profileForm.value;
      const addressData = this.addressForm.value;

      const updateData: UpdateProfileRequest = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        profile_image_id: profileImageId || undefined
      };

      // Add address if provided
      if (addressData.address || addressData.country || addressData.state || addressData.city || addressData.postal_code) {
        updateData.address = [{
          address: addressData.address,
          country: addressData.country,
          state: addressData.state,
          city: addressData.city,
          postal_code: addressData.postal_code,
          is_default: true
        }];
      }

      // Update profile
      const response = await this.userService.updateProfile(updateData).toPromise();

      if (response?.success) {
        this.user = response.data;
        this.successMessage = 'Profile updated successfully!';
        this.selectedFile = null;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } else {
        this.error = response?.message || 'Failed to update profile';
      }

    } catch (error: any) {
      this.error = error.message || 'Failed to update profile. Please try again.';
      console.error('Error updating profile:', error);
    } finally {
      this.saving = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
        if (fieldName === 'postal_code') return 'Please enter a valid postal code';
      }
    }
    return '';
  }

  getUserAvatar(): string {
    return this.imagePreview || this.userService.getUserAvatar(this.user);
  }

  getUserInitials(): string {
    return this.userService.getUserInitials(this.user);
  }

  cancel(): void {
    this.populateForm();
    this.selectedFile = null;
    this.imagePreview = this.user?.profile_image || null;
    this.error = null;
    this.successMessage = null;
  }
}
