import { Component, OnInit } from '@angular/core';
import { DataService, LastAtGround, LastAtGroundGames } from '../../services/data.service';
import { TitleService } from '../../services/title.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lastatground',
  imports: [CommonModule],
  templateUrl: './lastatground.component.html',
  styleUrl: './lastatground.component.scss'
})
export class LastatgroundComponent {

  lastatground: LastAtGround[] = [];

  selectedId: number | null = null;
  private string: any;

  constructor(private dataService: DataService,
              private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Last Games At Ground');
    this.dataService.getLastGamesAtGround().subscribe(items => {
      this.lastatground = items
    });
  }

  toggleDetails(recordId: number): void {
    if (this.selectedId === recordId) {
      this.selectedId = null;
    } else {
      this.selectedId = recordId;
    }
  }

}
