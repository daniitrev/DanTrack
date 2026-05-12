export interface GetPeriodSummaryDTO {
  startTime?: Date;
  endTime?: Date;
}

export interface GetDailyReports extends GetPeriodSummaryDTO {
  day?: Date;
}
