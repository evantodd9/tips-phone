import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';

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

export interface Round {
  round: string;
  games: Game[];
}

export interface Game {
  home: string;
  away: string;
  date: string;
  hprice: number;
  aprice: number;
  ground: string;
  starttime: string;
}

export interface User {
  name: string;
}

export interface LastMetGames {
  round: string;
  year: number;
  home: string;
  hscore: string;
  away: string;
  ascore: string;
  winner: string;
  margin: number;
  ground: string;
  result: string;
}

export interface LastMet {
  id: number;
  home: string;
  away: string;
  results: string;
  games: LastMetGames[];
}

export interface LastAtGroundGames {
  round: string;
  year: string;
  team: string;
  teamscore: string;
  opp: string;
  oppscore: string;
  result: string;
  winner: string;
}

export interface LastAtGround {
  id: number;
  team: string;
  ground: string;
  results: string;
  games: LastAtGroundGames[];
}

export interface Risk {
  id: number;
  user: string;
  home: number;
  away: number;
  favourite: number;
  outsider: number;
  homecorrect: number;
  awaycorrect: number;
  favouritecorrect: number;
  outsidercorrect: number;
  favbet: number;
  favreturn: number;
  outsiderbet: number;
  outsiderreturn: number;
}

export interface RiskStandard {
  id: number;
  user: string;
  home: number;
  away: number;
  favourite: number;
  outsider: number;
  homecorrect: number;
  awaycorrect: number;
  favouritecorrect: number;
  outsidercorrect: number;
  favbet: number;
  favreturn: number;
  outsiderbet: number;
  outsiderreturn: number;
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

  getTipRound(round: number): Observable<Round> {
    const roundUrl = 'assets/rnd' + round + '.json';
    return this.http.get<Round>(roundUrl);
  }

  getTipRoundAsPromise(round: number): Promise<Round> {
    return firstValueFrom(this.getTipRound(round));
  }

  getUsers(): Observable<User[]> {
    const userUrl = 'assets/users.json';
    return this.http.get<User[]>(userUrl);
  }

  getLastMet(): Observable<LastMet[]> {
    const lastmetUrl = 'assets/lastmet.json';
    return this.http.get<LastMet[]>(lastmetUrl).pipe(
      map(dataArray => {
        return dataArray.map((record, index) => {
          return {
            ...record,
            id: index + 1
          } as LastMet;
        });
      })
    );
  }

  getLastGamesAtGround(): Observable<LastAtGround[]> {
    const lastatgroundUrl = 'assets/lastgamesatground.json';
    return this.http.get<LastAtGround[]>(lastatgroundUrl).pipe(
      map(dataArray => {
        return dataArray.map((record, index) => {
          return {
            ...record,
            id: index + 1
          } as LastAtGround;
        });
      })
    );
  }

  getRisk(): Observable<Risk[]> {
    const riskUrl = 'assets/risk.json';
    return this.http.get<Risk[]>(riskUrl);
  }

  getRiskStandard(): Observable<RiskStandard> {
    const riskUrl = 'assets/riskstandard.json';
    return this.http.get<RiskStandard>(riskUrl);
  }

}
