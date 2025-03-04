import { Injectable } from '@angular/core';
import { Agent } from './agent.interface';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private apiService: ApiService) {}

  getAgents(): Observable<Agent[]> {
    return this.apiService.get('api/agent/AllAgent');
  }

  getAgent(id: string): Observable<Agent> {
    return this.apiService.get('api/agent/' + id);
  }

  createAgent(agent: Agent): Observable<boolean> {
    return this.apiService.post('api/agent/create', agent);
  }

  updateAgent(agent: Agent): Observable<boolean> {
    return this.apiService.patch('api/agent/update', agent);
  }

  deleteAgent(id: string): Observable<HttpEvent<boolean>> {
    return this.apiService.delete('api/agent/' + id, {});
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<boolean> {
    return this.apiService.post<boolean>('api/agent/changePassword', {
      currentPassword,
      newPassword,
    });
  }
}
