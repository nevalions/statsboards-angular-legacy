import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
})
export class MatchScoreboardAdminComponent implements OnInit, OnDestroy {
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.connect(82);
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
}
