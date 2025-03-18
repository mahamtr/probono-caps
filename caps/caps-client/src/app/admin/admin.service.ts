import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface ConfigItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private configsSubject = new BehaviorSubject<ConfigItem[]>([]);
  configs$ = this.configsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Fetch all configs and store them in memory
  fetchConfigs(): Observable<ConfigItem[]> {
    return this.apiService
      .get<ConfigItem[]>('api/config/all')
      .pipe(tap((configs) => this.configsSubject.next(configs)));
  }

  // Get a specific config by ID
  getConfig(id: string): Observable<ConfigItem> {
    return this.apiService.get<ConfigItem>(`api/config/${id}`);
  }

  // Create a new config
  createConfig(config: ConfigItem): Observable<boolean> {
    return this.apiService.post<boolean>('api/config/create', config).pipe(
      tap((success) => {
        if (success) {
          this.refreshConfigs();
        }
      })
    );
  }

  // Update an existing config
  updateConfig(config: ConfigItem): Observable<boolean> {
    return this.apiService.patch<boolean>(`api/config/update`, config).pipe(
      tap((success) => {
        if (success) {
          this.refreshConfigs();
        }
      })
    );
  }

  // Delete a config by ID
  deleteConfig(id: string): Observable<HttpEvent<boolean>> {
    return this.apiService
      .delete<boolean>(`api/config/${id}`, {})
      .pipe(tap(() => this.refreshConfigs()));
  }

  // Refresh the in-memory configs
  private refreshConfigs(): void {
    this.fetchConfigs().subscribe();
  }
}
