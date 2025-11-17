import { redirect } from "react-router";
import { userData } from "./auth";

export const authMiddleware = async ( _ : unknown , next : () => Promise<unknown>) => {
  const storedUserData = localStorage.getItem('lsAbu_CT_userData');
  if (storedUserData) {
    const parsedData = JSON.parse(storedUserData);
    userData.email = parsedData.email;
    userData.data = parsedData.data;
  }
  if (userData.email) {
    await next();
  }
  else
    throw redirect('/login');
}