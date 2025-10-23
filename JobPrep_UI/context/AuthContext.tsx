import { createContext } from "react";
import { type AuthResponse, type AuthState,  } from "../types";

export interface AuthContextType extends AuthState {
  login: (data: AuthResponse) => void;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading:null,
  login: () => {},
  logout: () => {},
});


