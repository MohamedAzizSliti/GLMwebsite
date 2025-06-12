import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'about-us',
        loadChildren: () =>
          import('./about-us/about-us.module').then((m) => m.AboutUsModule),
      },
      {
        path: 'blog-grid',
        loadChildren: () =>
          import('./blog-grid/blog-grid.module').then((m) => m.BlogGridModule),
      },
      {
        path: 'blog-list',
        loadChildren: () =>
          import('./blog-list/blog-list.module').then((m) => m.BlogListModule),
      },
      {
        path: 'blog-details',
        loadChildren: () =>
          import('./blog-details/blog-details.module').then(
            (m) => m.BlogDetailsModule
          ),
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
      },


      {
        path: 'become-an-expert',
        loadChildren: () =>
          import('./become-an-expert/become-an-expert.module').then(
            (m) => m.BecomeAnExpertModule
          ),
      },
      {
        path: 'become-an-student',
        loadChildren: () =>
          import('./become-an-student/become-an-student.module').then(
            (m) => m.BecomeAnStudentModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
