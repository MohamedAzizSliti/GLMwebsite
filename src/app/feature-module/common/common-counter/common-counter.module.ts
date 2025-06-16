import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonCounterComponent } from './common-counter.component';

@NgModule({
  declarations: [
    CommonCounterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonCounterComponent
  ]
})
export class CommonCounterModule { }
