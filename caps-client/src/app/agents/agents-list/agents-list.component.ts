import { Component } from '@angular/core';
import { AgentService } from '../agent/agent.service';
import { Agent } from '../agent/agent.interface';
import { catchError, Observable, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss'],
})
export class AgentsListComponent {
  agents$: Observable<Agent[]> = of([]);
  constructor(
    private agentService: AgentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // ngOnInit(): void {
  //   this.agents$ = this.agentService.getAgents().pipe(
  //     tap((agents) => console.log('Agents fetched:', agents)),
  //     catchError((error) => {
  //       console.error('Error fetching users:', error);
  //       return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
  //     })
  //   );a
  // }

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
