import { Component, OnInit } from '@angular/core';
import { DataService, TipsTotal } from '../../services/data.service';
import { NgFor, CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-tips-total',
  imports: [NgFor, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  tipsTotal: TipsTotal[] = [];
  loser: string = '';

  constructor(
    private dataService: DataService,
    private titleService: TitleService,
    private masterService: MasterService) {
    masterService.initialize();
  }

  ngOnInit(): void {
    this.dataService.getTipsTotal().subscribe(items => {
      this.tipsTotal = items;
    });
    this.titleService.setTitle('Tips');
    this.loser = 'assets/losers/' + this.masterService.getLoser() + '.jpg';
  }


}
