import { Component } from '@angular/core';
import { AgentService } from '../agent/agent.service';
import { Agent } from '../agent/agent.interface';
import { Observable, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss'],
})
export class AgentsListComponent {
  agents$: Observable<Agent[]> = of([]);
  canCreateAgent: boolean = false;
  canDeleteAgent: boolean = false;

  constructor(
    private agentService: AgentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.canCreateAgent = this.authService.canCreateAgent();
    this.canDeleteAgent = this.authService.canDeleteAgent();
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
  }

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.agents$ = this.agentService.getAgents();
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '300px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.agentService
          .deleteAgent(id.toString())
          .pipe(
            tap((success) => {
              if (success) {
                //TODO replace this with the snackbarService
                this.snackBar.open('Agent successfully deleted', 'Close', {
                  duration: 3000,
                });
                this.loadAgents();
              }
              // add error snackbar too
            })
          )
          .subscribe();
      }
    });
  }
}
