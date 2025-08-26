
export interface ICompany extends Document {
  name: string;
  email: string;
  number: string;
  companyName: string;
  message?: string; // Optional
}