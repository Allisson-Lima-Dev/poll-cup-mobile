import { createContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { api } from "../services/api";

interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
  isUseLoading: boolean;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }) {
  const [isUseLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);

  const [resquest, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
    }),
    scopes: ["profile", "email"],
  });

  async function signInWithGoogle(access_token: string) {
    setIsUserLoading(true);
    try {
      const { data } = await api.post("/users", { access_token });

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const { data: dataUser } = await api.get("/me");

      setUser(dataUser.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signIn() {
    setIsUserLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.log({ error });
      throw error;
    } finally {
      setIsUserLoading(true);
    }
  }

  useEffect(() => {
    if (response?.type === "success" && response?.authentication?.accessToken) {
      signInWithGoogle(response?.authentication?.accessToken);
    }
  }, [response]);
  return (
    <AuthContext.Provider
      value={{
        signIn,
        isUseLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
