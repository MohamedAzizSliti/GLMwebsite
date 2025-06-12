import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChatAssistantComponent } from './chat-assistant.component';
import { ChatAssistantPageComponent } from './chat-assistant-page.component';
import { SharedModule } from '../../../shared/shared-module';

@Pipe({
  name: 'nl2br',
  standalone: false
})
export class Nl2brPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/\n/g, '<br>');
  }
}

@NgModule({
  declarations: [
    DashboardComponent,
    ChatAssistantComponent,
    ChatAssistantPageComponent,
    Nl2brPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
