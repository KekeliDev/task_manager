import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Task } from 'src/app/models/task.model';
import { TaskserviceService } from 'src/app/services/task/taskservice.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskservice: TaskserviceService, private route: ActivatedRoute, private router: Router) { }

 
  listId!: string;

  ngOnInit() {
     // subscribing to route changes
     this.route.params.subscribe(
      (params: Params) => { 
       this.listId = params['listId'];
        }
        )
      }
  

  createTask(title: string){
    this.taskservice.createTask(title, this.listId).subscribe((newTask: Task) =>{
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }

}
