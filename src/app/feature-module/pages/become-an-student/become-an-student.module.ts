import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { LightgalleryModule } from 'lightgallery/angular';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared-module";
import {ToastrModule} from "ngx-toastr";
import {BecomeAnStudentComponent} from "./become-an-student.component";
import {BecomeAnStudentRoutingModule} from "./become-an-student-routing.module";

@NgModule({
  declarations: [
    BecomeAnStudentComponent
  ],
  imports: [
    CommonModule,
    BecomeAnStudentRoutingModule,
    CountUpModule,
    LightgalleryModule,
    FormsModule,
    ToastrModule,
    SharedModule
  ]
})
export class BecomeAnStudentModule { }
