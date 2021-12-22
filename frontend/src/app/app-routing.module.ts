import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { EditListComponent } from './pages/list/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/list/edit-task/edit-task.component';
import { NewListComponent } from './pages/list/new-list/new-list.component';
import { NewTaskComponent } from './pages/list/new-task/new-task.component';
import { TaskviewComponent } from './pages/taskview/taskview.component';
import { AllListsComponent } from './pages/all-lists/all-lists.component';

const routes: Routes = [
  { path: '', redirectTo:'lists', pathMatch: 'full' },
  { path: 'new-list', component: NewListComponent },
  { path: 'edit-list/:listId', component: EditListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  {path: 'lists', component: TaskviewComponent},
  {path: 'lists/:listId', component: TaskviewComponent},
  { path: 'lists/:listId/new-task', component: NewTaskComponent },
  { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
  { path: 'all-lists', component: AllListsComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
