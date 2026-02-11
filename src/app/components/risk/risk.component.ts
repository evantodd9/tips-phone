import {Component, OnInit, signal} from '@angular/core';
import { DataService, Risk, RiskStandard } from '../../services/data.service';
import { TitleService } from '../../services/title.service';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk',
  imports: [NgFor, CommonModule],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss'
})
export class RiskComponent implements OnInit {

  risk: Risk[] = [];
  riskstandard: RiskStandard = {} as RiskStandard;
  view = signal<'tips' | 'bets'>('tips');

  constructor(
    private titleService: TitleService,
    private dataService: DataService
  )
  {}

  ngOnInit(): void {
    this.dataService.getRisk().subscribe(items => {
      this.risk = items;
    });
    this.dataService.getRiskStandard().subscribe(item => {
      this.riskstandard = item;
    });
    this.titleService.setTitle('Risk Profile');
  }
}
