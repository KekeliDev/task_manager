import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { TaskserviceService } from 'src/app/services/task/taskservice.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {
    // injecting taskservice
  constructor(private taskservice: TaskserviceService, private router: Router)  { }

  ngOnInit(): void {
  }


  createList(title: string){
    this.taskservice.createList(title).subscribe((list: List) => {
      console.log(list);
      // redirect to /lists/response._id
      this.router.navigate(['/lists',list._id]);
      
    });
  }

  
}
