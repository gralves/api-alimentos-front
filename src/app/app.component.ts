import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Http, Response, ResponseContentType } from '@angular/http'
import { Observable } from 'rxjs/Observable';

export var urlConfig: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private http: Http) {
   
    
  }
  
  loadUrlServices():Observable<String> {
    this.http.get('assets/app-pedidos.json').subscribe((res: Response) => {
      urlConfig = res.json().urlServices;
    });

    return this.http.get('assets/app-pedidos.json').map(res => res.json());
  }


}


