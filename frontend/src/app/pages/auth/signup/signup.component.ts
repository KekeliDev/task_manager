import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/webservices/authservices/authservice.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor( private authservice: AuthserviceService, private router: Router ) { }

  ngOnInit(): void {
  }


  registerUser(email: string, firstName: string, lastName: string, password: string) {
    this.authservice.register(email,firstName, lastName, password).subscribe((res: HttpResponse<any>) =>{
      if(res.status === 200) {
        this.router.navigate(['/lists']);
      }
      
      console.log(res)
   })
  }

}
