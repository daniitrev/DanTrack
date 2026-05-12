import { DatePipe } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {TimeEntryPageStore} from './store/page-time-entries';
import {TaskStartComponent} from '../page-task/ui/task-start/task-start';
import {UiButton} from '../../../../shared/ui/button';

@Component({
  selector: 'app-time-entries-page',
  standalone: true,
  templateUrl: './page-time-entries.html',
  styleUrl: './page-time-entries.scss',
  providers: [TimeEntryPageStore],
  imports: [DatePipe, TaskStartComponent, UiButton],
})
export class TimeEntriesPage implements OnInit {
  readonly store = inject(TimeEntryPageStore)


  stopTimeEntry(timeEntryId: string) {
    this.store.stopTimeEntry({ timeEntryId })
  }
  ngOnInit() {
    this.store.loadPage()
  }
}
