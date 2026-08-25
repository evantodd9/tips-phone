import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { DataService, TipsTotal } from '../../services/data.service';
import { MasterService } from '../../services/master.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type Team = 'home' | 'away';
type FormPayload = Record<string,any>;

interface UserTip {
  gameId: string;
  selection: Team;
}

class TipGame {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  ground: string;
  starttime: string;
  defaulttip: Team;
  expired: boolean;
  odds: {
    home: number;
    away: number;
  }

  constructor (
    id: string,
    date: string,
    homeTeam: string,
    awayTeam: string,
    ground: string,
    starttime: string,
    odds: {
      home: number,
      away: number
    }) {

    this.id = id;
    this.date = date;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.ground = ground;
    this.odds = odds;
    this.starttime = starttime;
    this.expired = (Date.now() > (new Date(this.starttime).getTime()) + 3600000);
    if (odds.home <= odds.away) {
      this.defaulttip = 'home' as Team;
    }
    else {
      this.defaulttip = 'away' as Team;
    }
  }
}

interface BetOutcome {
  gameId: string;
  team: Team;
  odds: number;
  teamName: string;
}

interface Bet {
  id: number;
  stake: number;
  outcomes: BetOutcome[];
  isMulti: boolean;
  totalOdds: number;
  potentialReturn: number;
}

@Component({
  selector: 'app-tipentry',
  imports: [CommonModule, FormsModule],
  templateUrl: './tipentry.component.html',
  styleUrl: './tipentry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TipentryComponent implements OnInit {

  round: number = 1;
  min: number = 1;
  max: number = 26;
  sledging: string = '';
  roundtitle: string = '';

  view = signal<'tips' | 'bets'>('tips');
  users = signal<string[]>(['anna','ev','punk','purse','smith','tip-o-meter','wigg']);
  games = signal<TipGame[]>([]);
  selectedUser = signal<string | null>(null);
  account : number = 0;

  tips = signal<UserTip[]>([]);
  bets = signal<Bet[]>([]);
  currentBetOutcomes = signal<BetOutcome[]>([]);
  currentStake = signal<number>(0);
  currentBetError = signal<string | null>(null);

  submissionMessage = signal<string | null>(null);
  submissionSuccess = signal<boolean>(false);

  private formsUrl = 'https://formsubmit.co/ajax/ejt@qad.com';
  private userDetails : TipsTotal[] = [];

  totalTips = computed(() => this.tips().length);
  totalWagered = computed(() => this.bets().reduce((sum, bet) => sum + bet.stake,0));

  remainingBudget = computed(() => this.account - this.totalWagered());

  canSubmit = computed(() => !!this.selectedUser() && this.totalTips() == this.games().length && this.remainingBudget() >= 0);

  currentTotalOdds = computed(() => {
    return this.currentBetOutcomes().reduce((acc, outcome) => acc * outcome.odds, 1);
  });

  isPlaceBetEnabled = computed(() => {
    return this.currentStake() > 0 &&
      this.currentStake() <= this.account &&
      this.currentBetOutcomes().length > 0 &&
      this.remainingBudget() >= this.currentStake();
  });

  constructor(
    private dataService: DataService,
    private titleService: TitleService,
    private masterService: MasterService,
    private http: HttpClient) {}

  ngOnInit(): void {
    this.round = this.masterService.getRound();
    this.min = this.round;
    this.max = this.masterService.getMax();
    this.dataService.getTipsTotal().subscribe(items => {
      this.userDetails = items;
    });
    this.loadGames();
  }

  async loadGames(): Promise<void> {
    const currentRound = await this.dataService.getTipRoundAsPromise(this.round);
    this.roundtitle = currentRound.round + ' Tips';
    this.titleService.setTitle(this.roundtitle);
    const rnd : TipGame[] = [];
    var i = 1;
    for (var g of currentRound.games) {
      var id = 'Tip' + i.toString();
      var gm = new TipGame(id, g.date, g.home, g.away, g.ground, g.starttime, {home: g.hprice, away: g.aprice});
      rnd.push(gm);
      i++;
    }

    this.games.set(rnd);
  }

  selectUser(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedUser.set(target.value);
    this.submissionMessage.set(null);
    var userDetail : TipsTotal | undefined = this.userDetails.find(u => u.name === target.value);
    if (userDetail) {
      this.account = userDetail.amount;
    }
    else {
      this.account = 0;
    }
    this.tips.set([]);
    this.bets.set([]);

    this.games().forEach(game => {
      if (game.expired) {
        this.toggleTip(game.id, game.defaulttip);
      }
    });

  }

  getTipText(gameId: string): string {
    const tip = this.tips().find(t => t.gameId === gameId);
    if (!tip) return 'No selection';

    const game = this.getGameById(gameId);
    if (!game) return 'Error';

    if (tip.selection === 'home') return `${game.homeTeam}`;
    if (tip.selection === 'away') return `${game.awayTeam}`;
    return '';
  }

  isTipped(gameId: string, team: Team): boolean {
    return !!this.tips().find(t => t.gameId === gameId && t.selection === team);
  }

  toggleTip(gameId: string, selection: Team) {
    if (!this.selectedUser()) {
      this.submissionMessage.set('Select your name');
      return;
    }

    this.tips.update(currentTips => {
      const existingTipIndex = currentTips.findIndex(t => t.gameId === gameId);

      if (existingTipIndex !== -1) {
        if (currentTips[existingTipIndex].selection === selection) {
          return currentTips.filter(t => t.gameId !== gameId);
        }

        const updatedTips = [...currentTips];
        updatedTips[existingTipIndex] = { gameId, selection };

        return updatedTips;
      }
      else {
        return [...currentTips, { gameId, selection }];
      }
    });
  }

  getGameById(id: string): TipGame | undefined {
    return this.games().find(g => g.id === id);
  }

  getBettingOutcomes(game: TipGame) {
    return [
      { team: 'home' as Team, name: game.homeTeam, odds: game.odds.home },
      { team: 'away' as Team, name: game.awayTeam, odds: game.odds.away }
    ];
  }

  isOutcomeInSlip(gameId: string, team: Team): boolean {
    return !!this.currentBetOutcomes().find(o => o.gameId == gameId && o.team == team);
  }

  addToSlip(game: TipGame, team: Team) {
    if (!this.selectedUser()) {
      this.submissionMessage.set('Please select your name first.');
      return;
    }

    const currentOutcomes = this.currentBetOutcomes();
    const existingIndex = currentOutcomes.findIndex(o => o.gameId === game.id);

    // If the game is already in the slip, remove it first (to prevent conflicting picks from the same game)
    let updatedOutcomes = currentOutcomes;
    if (existingIndex !== -1) {
      updatedOutcomes = currentOutcomes.filter(o => o.gameId !== game.id);
    }

    // Now, add the new outcome (or if it was just deselected, it won't be added back)
    const odds = game.odds[team];
    let teamName: string;
    if (team === 'home') teamName = game.homeTeam;
    else if (team === 'away') teamName = game.awayTeam;
    else teamName = 'Draw';

    const newOutcome: BetOutcome = { gameId: game.id, team, odds, teamName };

    // If the same outcome was clicked (and thus removed in the filter), don't add it back.
    if (!this.isOutcomeInSlip(game.id, team)) {
      updatedOutcomes = [...updatedOutcomes, newOutcome];
    }

    this.currentBetOutcomes.set(updatedOutcomes);
    this.currentBetError.set(null);
  }

  removeFromSlip(gameId: string) {
    this.currentBetOutcomes.update(outcomes => outcomes.filter(o => o.gameId !== gameId));
    this.currentBetError.set(null);
  }

  placeBet() {
    const stake = this.currentStake();
    const outcomes = this.currentBetOutcomes();
    const totalOdds = this.currentTotalOdds();
    const isMulti = outcomes.length > 1;

    // Final Validation check
    if (!this.isPlaceBetEnabled()) {
      let error = '';
      if (outcomes.length === 0) error = 'Please select at least one outcome for your bet.';
      else if (stake <= 0) error = 'Stake must be greater than $0.';
      else if (stake > this.account) error = 'Stake cannot exceed account limit.';
      else if (this.remainingBudget() < stake) error = `Insufficient funds. Remaining budget: $${this.remainingBudget().toFixed(2)}.`;
      this.currentBetError.set(error);
      return;
    }

    const newBet: Bet = {
      id: Date.now(),
      stake,
      outcomes,
      isMulti,
      totalOdds: totalOdds,
      potentialReturn: stake * totalOdds,
    };

    this.bets.update(currentBets => [...currentBets, newBet]);

    // Reset slip
    this.currentStake.set(0);
    this.currentBetOutcomes.set([]);
    this.currentBetError.set(null);
  }

  buildEmailContent(): FormPayload {
    const content: FormPayload = {};
    content['name'] = this.selectedUser();

    this.games().forEach(game => {
      const tip = this.tips().find(t => t.gameId === game.id);
      const selectionText = tip ? this.getTipText(game.id): 'None';
      content[game.id] = selectionText;
    });

    if (this.bets().length > 0) {
      this.bets().forEach((bet, index) => {
        const key = `Bet${index + 1}`;
        let value = ``;
        let multi: boolean = false;
        bet.outcomes.forEach(o => {
          const game = this.getGameById(o.gameId);
          if (game) {
            if (multi) {
              value += ',';
            }
            value += `${o.teamName}`;
            multi = true;
          }
        });
        value += ` $${bet.stake} @ ${bet.totalOdds.toFixed(2)}`;
        content[key] = value;
      });
    }
    if (this.sledging !== '') {
      content['sledging'] = this.sledging;
    }

    content['_subject'] = this.roundtitle + ` footy tips - ` + this.selectedUser();
    content['_captcha'] = 'false';
    content['_cc'] = `evantodd9@gmail.com,dr.alex.e.smith@gmail.com,adamwigg@gmail.com,steven.purse@gmail.com,sam.wigg@harrisre.com.au,torismith13@icloud.com`

    return content;
  }

  async submitTips() {
    if (!this.canSubmit()) {
      if (!this.selectedUser()) {
        this.submissionMessage.set('Select your name');
      }
      else if (this.totalTips() < this.games().length) {
        this.submissionMessage.set('You are missing some tips');
      }
      else if (this.remainingBudget() < 0) {
        this.submissionMessage.set('You bet too much');
      }
      this.submissionSuccess.set(false);
      return;
    }

    this.submissionMessage.set('Submitting..');
    this.submissionSuccess.set(false);

    console.log(this.buildEmailContent());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post(this.formsUrl, this.buildEmailContent(), { headers: headers})
      .subscribe({
        next: (response) => {
          if (response && (response as any).success === 'true') {
            this.submissionSuccess.set(true);
            this.submissionMessage.set('Submitted');
          }
          else {
            this.submissionSuccess.set(false);
            this.submissionMessage.set('Failed');
          }
        }
      });
  }

  previousRound(): void {
    this.round--;
    this.loadGames();
    this.titleService.setTitle('Round ' + this.round + ' Tips');
  }

  nextRound(): void {
    this.round++;
    this.loadGames();
    this.titleService.setTitle('Round ' + this.round + ' Tips');
  }
}
