import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private title = new BehaviorSubject<string | null>(null);

  title$ = this.title.asObservable();

  constructor() { }

  setTitle(title: string) {
    this.title.next(title);
  }
}
