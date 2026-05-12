import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportsPageStore } from './store/page-reports';
import { UiButton } from '../../../../shared/ui/button';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  templateUrl: './page-reports.html',
  styleUrl: './page-reports.scss',
  imports: [CommonModule, ReactiveFormsModule, UiButton],
  providers: [ReportsPageStore]
})
export class ReportsPage {
  readonly store = inject(ReportsPageStore);
  readonly periodForm = new FormGroup({
    startTime: new FormControl(this.formatDate(this.startOfCurrentMonth()), { nonNullable: true }),
    endTime: new FormControl(this.formatDate(new Date()), { nonNullable: true }),
  });

  constructor() {
    this.loadReports();
  }

  loadReports() {
    const { startTime, endTime } = this.periodForm.getRawValue();

    if (startTime && endTime) {
      const payload = {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      this.store.loadSummary(payload);
      this.store.loadByProject(payload);
      this.store.loadByMember(payload);
      this.store.loadDaily(payload);
    }
  }

  private startOfCurrentMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
