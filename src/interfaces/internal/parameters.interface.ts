export interface PaginateParameters {
  start: number;
  limit: number;
}

export interface DateParameters {
  startDate: Date;
  endDate: Date;
}

export interface UserParameters {
  userId: number;
}

export interface BaseFindParameters
  extends Partial<PaginateParameters>,
    Partial<DateParameters>,
    Partial<UserParameters> {}

export interface BaseGetParameters extends BaseFindParameters {
  id: number;
}
