import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TitleService } from './services/title.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title: Observable<string | null>;
  isMenuOpen: boolean = false;

  constructor(private titleService: TitleService) {
    titleService.setTitle('Standings');
    this.title = titleService.title$;
  }

  ngOnInit() {}
}
