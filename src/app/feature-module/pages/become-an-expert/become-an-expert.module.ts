import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { BecomeAnExpertRoutingModule } from './become-an-expert-routing.module';
import { BecomeAnExpertComponent } from './become-an-expert.component';
import { LightgalleryModule } from 'lightgallery/angular';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared-module";
import {ToastrModule} from "ngx-toastr";


@NgModule({
  declarations: [
    BecomeAnExpertComponent
  ],
  imports: [
    CommonModule,
    BecomeAnExpertRoutingModule,
    CountUpModule,
    LightgalleryModule,
    FormsModule,
    ToastrModule,
    SharedModule
  ]
})
export class BecomeAnExpertModule { }
