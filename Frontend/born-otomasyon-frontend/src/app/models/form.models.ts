export interface FormDataRequest {
  text1: string;
  num1: number;
  date1: Date;
}

export interface FormDataResponse extends FormDataRequest {
  id: number;
  userId: string;
  createdAt: Date;
}
