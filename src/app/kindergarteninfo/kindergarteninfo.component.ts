import { Component, OnInit } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Kindergarden } from '../shared/interfaces/Kindergarden';

@Component({
  selector: 'app-kindergarteninfo',
  templateUrl: './kindergarteninfo.component.html',
  styleUrls: ['./kindergarteninfo.component.scss']
})
export class KindergarteninfoComponent {

  public kindergardens: Kindergarden[] = [];

  public imagePath: string = "./../assets/images/Kindergarten.jpg";

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getKindergardens().subscribe(
      (data: Kindergarden[]) => {
        this.kindergardens = data;
      },
      error => {
        console.error('Error fetching kindergartens:', error);
      }
    );
  }
}
