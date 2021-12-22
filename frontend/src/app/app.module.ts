import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskviewComponent } from './pages/taskview/taskview.component';
import { NewListComponent } from './pages/list/new-list/new-list.component';
import { NewTaskComponent } from './pages/list/new-task/new-task.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { WebserviceInterceptorService } from './services/webservices/webservice-interceptor/webservice-interceptor.service';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { EditListComponent } from './pages/list/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/list/edit-task/edit-task.component';
import { summernote } from '../../bower_components/angular';
import { AllListsComponent } from './pages/all-lists/all-lists.component'

@NgModule({
  declarations: [
    AppComponent,
    TaskviewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginComponent,
    SignupComponent,
    EditListComponent,
    EditTaskComponent,
    AllListsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebserviceInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
