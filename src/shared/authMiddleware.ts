import { redirect } from "react-router";
import { userData } from "./auth";

export const authMiddleware = async ( _ : unknown , next : () => Promise<unknown>) => {
  if (userData.email) {
    await next();
  }
  else
    throw redirect('/login');
}