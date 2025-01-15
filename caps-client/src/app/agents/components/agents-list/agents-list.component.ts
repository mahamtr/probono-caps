import { Component } from '@angular/core';
import { AgentService } from '../../agent/agent.service';
import { Agent } from '../../agent/agent.interface';
import { catchError, Observable, of, tap } from 'rxjs';
@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss'],
})
export class AgentsListComponent {
  agents$: Observable<Agent[]> = of([]);
  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agents$ = this.agentService.getAgents().pipe(
      tap((agents) => console.log('Agents fetched:', agents)),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
      })
    );
  }
}
