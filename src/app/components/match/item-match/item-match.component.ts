import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { environment } from '../../../../environments/environment';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { IMatch } from '../../../type/match.type';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { Person } from '../../person/person';
import { AddEditPlayerMatchTableComponent } from '../../player-match/add-edit-player-match-table/add-edit-player-match-table.component';
import { PlayerInMatch } from '../../player-match/player-match';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Player } from '../../player/player';
import { Position } from '../../position/postion';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { Team } from '../../team/team';
import { Tournament } from '../../tournament/tournament';
import { AddEditMatchComponent } from '../add-edit-match/add-edit-match.component';
import { Match } from '../match';
import { ParseButtonComponent } from '../../../shared/ui/buttons/parse-button/parse-button.component';
import { QrComponent } from '../../../shared/ui/qr/qr.component';
import { TuiCardLarge } from "@taiga-ui/layout";

@Component({
  selector: 'app-item-match',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    TitleCasePipe,
    TuiCardLarge,
    TuiTitle,
    TuiAppearance,
    TitleCasePipe,
    AsyncPipe,
    DatePipe,
    TuiButton,
    DeleteDialogComponent,
    DeleteButtonComponent,
    EditButtonComponent,
    AddEditMatchComponent,
    TitleCasePipe,
    BodyListTitleComponent,
    AddEditPlayerMatchTableComponent,
    ParseButtonComponent,
    QrComponent,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent {
  private season = inject(Season);
  private sport = inject(Sport);
  private sponsor = inject(Sponsor);
  private sponsorLine = inject(SponsorLine);
  private tournament = inject(Tournament);
  private team = inject(Team);
  private person = inject(Person);
  private player = inject(Player);
  private playerInTeamTournament = inject(PlayerInTeamTournament);
  private playerInMatch = inject(PlayerInMatch);
  private position = inject(Position);
  private match = inject(Match);
  private matchWithFullData = inject(MatchWithFullData);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  season$ = this.season.season$;
  sport$ = this.sport.currentSport$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;
  allSportTeams$ = this.team.teamsInSport$;
  // matchSponsorLine$ = this.sponsorLine.matchSponsorLine$;
  match$ = this.matchWithFullData.matchWithFullData$;
  tournament$ = this.tournament.currentTournament$;
  teamsInTournament$ = this.team.teamsInTournament$;
  allPlayersInMatch$ = this.playerInMatch.allPlayersFullDataInMatch$;
  availableMatchHomePlayers$ =
    this.playerInTeamTournament.availableMatchHomePlayers$;
  availableMatchAwayPlayers$ =
    this.playerInTeamTournament.availableMatchAwayPlayers$;
  homeRoster$ = this.playerInMatch.homeRoster$;
  awayRoster$ = this.playerInMatch.awayRoster$;
  homeFootballOffense$ = this.playerInMatch.homeFootballOffense$;
  awayFootballOffense$ = this.playerInMatch.awayFootballOffense$;
  homeFootballDefense$ = this.playerInMatch.homeFootballDefense$;
  awayFootballDefense$ = this.playerInMatch.awayFootballDefense$;
  homeFootballStartOffense$ = this.playerInMatch.homeFootballStartOffense$;
  awayFootballStartOffense$ = this.playerInMatch.awayFootballStartOffense$;
  homeFootballStartDefense$ = this.playerInMatch.homeFootballStartDefense$;
  awayFootballStartDefense$ = this.playerInMatch.awayFootballStartDefense$;

  allSportPositions$ = this.position.allSportPositions$;

  playerInMatchIsLoading$ = this.playerInMatch.playerInMatchIsLoading$;

  constructor() {
    const sponsor = this.sponsor;
    const sponsorLine = this.sponsorLine;
    const tournament = this.tournament;
    const team = this.team;
    const playerInTeamTournament = this.playerInTeamTournament;
    const playerInMatch = this.playerInMatch;
    const position = this.position;
    const match = this.match;

    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    sponsorLine.loadMatchSponsorLineWithFullData();
    match.loadCurrentMatch();
    tournament.loadCurrentTournament();
    playerInTeamTournament.loadAllPlayersForMatch();
    position.loadAllPositionsBySportId();
    playerInMatch.loadAllPlayersFullDataInMatch();
    team.loadAllTeamsInTournament();
  }

  qrMatchUrl(
    sport_id: number,
    season_id: number,
    tournament_id: number,
    match_id: number,
  ): string {
    if (sport_id && season_id && match_id && tournament_id) {
      return `https://${environment.url}${environment.angular_port}/sport/${sport_id}/season/${season_id}/tournament/${tournament_id}/match/${match_id}`;
    } else {
      return `https://${environment.url}${environment.angular_port}`;
    }
  }

  buttonTitle: string = 'Match';

  navigateToWebSocketItem(): void {
    // this.router.navigate(['admin'], { relativeTo: this.route });
    const urlTree = this.router.createUrlTree(['admin'], { relativeTo: this.route });

    // Serialize it to a string
    const url = this.router.serializeUrl(urlTree);

    // Get the full URL
    const fullUrl = window.location.origin + url;

    // Open in new window
    window.open(fullUrl, '_blank');
  }

  navigateToWebSocketScoreboardDisplay(match_id: number) {
    if (match_id) {
      window.open(
        `http://${environment.url}${environment.angular_port}/scoreboard/match/${match_id}/hd/`,
        '_blank',
      );
    }
  }

  onMatchEdit(match: IMatch | null | undefined): void {
    // console.log(match);
    if (match && match.id) {
      // console.log(match);
    } else {
      // console.log('Match data is empty');
    }
  }

  onDelete() {
    this.match.deleteMatch();
  }

  parsPlayerFromEESL() {
    this.playerInMatch.parsPlayersFromEESL();
  }

  protected readonly TuiAppearance = TuiAppearance;
}
