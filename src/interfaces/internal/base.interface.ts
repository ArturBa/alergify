export interface BaseInterface {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseUserInterface extends BaseInterface {
  userId: number;
}
