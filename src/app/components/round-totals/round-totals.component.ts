import { Component, OnInit } from '@angular/core';
import { DataService, RoundTotals } from '../../services/data.service';
import { NgFor, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-round-totals',
  imports: [NgFor, CommonModule],
  templateUrl: './round-totals.component.html',
  styleUrl: './round-totals.component.scss'
})
export class RoundTotalsComponent implements OnInit {

  roundTotals: RoundTotals[] = [];
  round: number = 1;
  max: number = 1;

  constructor(
    private dataService: DataService,
    private titleService: TitleService,
    private masterService: MasterService) {}

  ngOnInit(): void {
    this.round = this.masterService.getRound() - 1;
    this.max = this.round;
    this.dataService.getRoundTotals(this.round).subscribe(items => {
      this.roundTotals = items;
    });
    this.titleService.setTitle('Round ' + this.round + ' Results');
  }

  previousRound(): void {
    this.round--;
    this.dataService.getRoundTotals(this.round).subscribe(items => {
      this.roundTotals = items;
    });
    this.titleService.setTitle('Round ' + this.round + ' Results');
  }

  nextRound(): void {
    this.round++;
    this.dataService.getRoundTotals(this.round).subscribe(items => {
      this.roundTotals = items;
    });
    this.titleService.setTitle('Round ' + this.round + ' Results');
  }
}
