import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, firstValueFrom} from 'rxjs';

export interface Master {
  round: number,
  name: string,
  loser: string,
  max: number
}

export interface TipsTotal {
  name: string;
  total: number;
  amount: number;
}

export interface RoundTotals {
  name: string;
  tips: number;
  bets: number;
  return: number;
}

export interface Game {
  home: string;
  away: string;
  date: string;
  hprice: number;
  aprice: number;
  ground: string;
}

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private http = inject(HttpClient);
  constructor() { }

  getTipsTotal(): Observable<TipsTotal[]> {
    const tipsTotalUrl = 'assets/tips-total.json';
    return this.http.get<TipsTotal[]>(tipsTotalUrl);
  }

  getRoundTotals(round: number): Observable<RoundTotals[]> {
    const roundTotalsUrl = 'assets/round' + round + 'totals.json';
    return this.http.get<RoundTotals[]>(roundTotalsUrl);
  }

  getMaster(): Observable<Master> {
    const masterUrl = 'assets/master.json';
    return this.http.get<Master>(masterUrl);
  }

  getTipRound(round: number): Observable<Game[]> {
    const gameUrl = 'assets/round' + round + '.json';
    return this.http.get<Game[]>(gameUrl);
  }

  getTipRoundAsPromise(round: number): Promise<Game[]> {
    return firstValueFrom(this.getTipRound(round));
  }

  getUsers(): Observable<User[]> {
    const userUrl = 'assets/users.json';
    return this.http.get<User[]>(userUrl);
  }
}
