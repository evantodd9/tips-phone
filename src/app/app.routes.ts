import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RoundTotalsComponent } from './components/round-totals/round-totals.component';
import { TipentryComponent } from './components/tipentry/tipentry.component';
import { LastmeetingComponent } from './components/lastmeeting/lastmeeting.component';
import { LastatgroundComponent } from './components/lastatground/lastatground.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'results', component: RoundTotalsComponent},
  { path: 'tips', component: TipentryComponent},
  { path: 'lastmet', component: LastmeetingComponent},
  { path: 'lastatground', component: LastatgroundComponent}
];
