import { Injectable } from '@angular/core';
import { Agent } from './agent.interface';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private apiService: ApiService) {}

  getAgents(): Observable<Agent[]> {
    return this.apiService.get('api/agent/AllAgent');
  }
}
