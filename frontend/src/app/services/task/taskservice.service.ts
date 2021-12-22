import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { WebserviceService } from '../webservices/webservice.service';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {
    // injecting webservice
  constructor( private webservice: WebserviceService) { } 

  userdata: User;

  getUserData(id: string,  userdata){
    return this.webservice.get(`users/${id},${userdata}`)
  }

  createList(title: string) {
    return this.webservice.post('/lists', {title});
  }


  getLists(){
    return this.webservice.get('/lists',)
  }
  getAllLists(){
    return this.webservice.get('/all-lists',)
  }


  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webservice.patch(`/lists/${id}`, { title });
  }

  deleteList(id: string) {
    return this.webservice.delete(`/lists/${id}`);
  }

  // Tasks

  getTasks(listId: string){
    return this.webservice.get(`/lists/${listId}/tasks`);
  }


  createTask(title: string, listId: string) {
    return this.webservice.post(`/lists/${listId}/tasks`, {title});
  }

  completedTask(task: Task){
    return this.webservice.patch(`/lists/${task._listId}/tasks/${task._id}`, 
    {
      completed: !task.completed
    });
  }

 

  deleteTask(listId: string, taskId: string) {
    return this.webservice.delete(`/lists/${listId}/tasks/${taskId}`);
  }

  complete(task: Task) {
    return this.webservice.patch(`/lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.webservice.patch(`/lists/${listId}/tasks/${taskId}`, { title });
  }
}
