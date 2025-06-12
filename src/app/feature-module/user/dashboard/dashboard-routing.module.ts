import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ChatAssistantPageComponent } from './chat-assistant-page.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'chat-assistant', component: ChatAssistantPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
