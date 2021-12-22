import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { TaskserviceService } from 'src/app/services/task/taskservice.service';

@Component({
  selector: 'app-taskview',
  templateUrl: './taskview.component.html',
  styleUrls: ['./taskview.component.scss']
})
export class TaskviewComponent implements OnInit {

  user: User;
  lists: List[];
  tasks: Task[];
  selectedListId: string;

  // injecting taskservice
  constructor(private taskservice: TaskserviceService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // subscribing to route changes
    this.route.params.subscribe(
      (params: Params) =>{
        if(params.listId){
          this.selectedListId = params.listId;
          this.taskservice.getTasks(params.listId).subscribe((tasks: Task[]) => {

            this.tasks = tasks;
          });
        } else {
          this.tasks = undefined;
        }

      }

      
    )

    this.taskservice.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    })
  }

  onTaskClick(task: Task){
    this.taskservice.completedTask(task).subscribe(() =>{
      task.completed = !task.completed;
    })
  }

  onDeleteListClick() {
    this.taskservice.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

  onTaskDelete(id: string) {
    this.taskservice.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

}
