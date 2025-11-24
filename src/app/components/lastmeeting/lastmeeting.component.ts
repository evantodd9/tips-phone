import { Component, OnInit } from '@angular/core';
import { DataService, LastMet, LastMetGames } from '../../services/data.service';
import { TitleService } from '../../services/title.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lastmeeting',
  imports: [CommonModule],
  templateUrl: './lastmeeting.component.html',
  styleUrl: './lastmeeting.component.scss'
})
export class LastmeetingComponent implements OnInit {

  lastmet: LastMet[] = [];

  selectedId: number | null = null;
  private string: any;

  constructor(private dataService: DataService,
              private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Last Meetings');
    this.dataService.getLastMet().subscribe(items => {
      this.lastmet = items
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
