import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClaimsComponent } from './pages/claims/claims.component';
import { StudentsComponent } from './components/students/students.component';
import { SchoolsComponent } from './components/schools/schools.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'claims', component: ClaimsComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'students', component: StudentsComponent },
      { path: 'schools', component: SchoolsComponent },
      { path: '', redirectTo: 'schools', pathMatch: 'full' }
    ]
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

