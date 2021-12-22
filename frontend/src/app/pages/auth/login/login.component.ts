import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/webservices/authservices/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authservice: AuthserviceService, private router: Router) { }

  ngOnInit(): void {
  }


  loginUser( email: string, password: string){
      this.authservice.login(email, password).subscribe((res: HttpResponse<any>) =>{
        
        if(res.status === 200) {
          this.router.navigate(['/lists']);
        }
        
        console.log(res);

      })

    }
}
