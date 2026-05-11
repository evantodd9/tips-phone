import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  round: number;
  max: number;
  users: string[];
  loser: string;

  constructor(private dataService: DataService) {
    this.round = 1;
    this.max = 25;
    this.users = [];
    this.loser = '';
  }

  // Temporary while on holiday
  getWeeklyValue(): number {
    const now = new Date();

    const startDate = new Date(2026, 4, 4);

    // Calculate the difference in milliseconds
    const diffInMs = now.getTime() - startDate.getTime();

    // Convert milliseconds to weeks
    const weeksPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

    return 9 + weeksPassed;
  }

  initialize(): void {
    this.dataService.getMaster().subscribe(
      {
        next: (m) => {
          this.round = m.round;
          this.max = m.max;
          this.loser = m.loser;
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
    return this.getWeeklyValue();
    //return this.round;
  }

  getMax(): number {
    return this.max;
  }

  getLoser(): string {
    return this.loser;
  }

  getUsers(): string[] {
    return this.users;
  }
}
