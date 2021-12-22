import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TaskserviceService } from 'src/app/services/task/taskservice.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private taskservice: TaskserviceService, private router: Router, private route: ActivatedRoute) { }

  listId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) =>{
        this.listId = params.listId;
        console.log(params.listId)
      })
  }


  updateList(title: string){
    this.taskservice.updateList(this.listId, title).subscribe(() =>{
      this.router.navigate(['/lists', this.listId]);
    })
  }
      
   
}
