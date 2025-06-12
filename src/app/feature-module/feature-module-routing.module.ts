import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureModuleComponent,
    children: [
      { path: 'index', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'course', loadChildren: () => import('./course/course.module').then(m => m.CourseModule) },
      { path: 'car', loadChildren: () => import('./car/car.module').then(m => m.CarModule) },
       { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
       { path: 'agent', loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule) },
      ],
  },















];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureModuleRoutingModule {}
