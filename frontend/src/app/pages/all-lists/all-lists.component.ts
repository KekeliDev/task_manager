import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { TaskserviceService } from 'src/app/services/task/taskservice.service';

@Component({
  selector: 'app-all-lists',
  templateUrl: './all-lists.component.html',
  styleUrls: ['./all-lists.component.scss']
})
export class AllListsComponent implements OnInit {
  lists: List[];

  constructor(private taskservice: TaskserviceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

      this.taskservice.getLists().subscribe((lists: List[]) => {
        this.lists = lists;
      })
  
  }
}
