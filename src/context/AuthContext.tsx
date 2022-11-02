import { createContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

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
    clientId:
      "892878472888-dg2e5eaos8jc27diji9s84p0oa3t96a3.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
    }),
    scopes: ["profile", "email"],
  });

  async function signInWithGoogle(access_token: string) {
    console.log({ access_token });
  }

  async function signIn() {
    setIsUserLoading(true);
    try {
      const result = await promptAsync();
      //   setUser(result);
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
