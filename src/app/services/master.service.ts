import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  round: number;
  max: number;
  users: string[];

  constructor(private dataService: DataService) {
    this.round = 1;
    this.max = 25;
    this.users = [];
  }

  initialize(): void {
    this.dataService.getMaster().subscribe(
      {
        next: (m) => {
          this.round = m.round;
          this.max = m.max;
        }
      }
    );

    this.dataService.getUsers().subscribe(
      {
        next: (u) => {
          for (var i in u) {
            this.users.push(u[i].name);
          }
        }
      }
    )
  }

  getRound(): number {
    return this.round;
  }

  getMax(): number {
    return this.max;
  }

  getUsers(): string[] {
    return this.users;
  }
}
