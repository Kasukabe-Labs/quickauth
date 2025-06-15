import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  pfp: string;
  password: string;
  oauth: boolean;
}
