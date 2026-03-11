import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      // Supabase will update session automatically via listener
      return { success: true, session: data.session };
    } catch (err) {
      console.error("Unexpected sign-in error:", err.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  // Restore session on app load + listen for changes.
  // If no session exists, sign in anonymously so every visitor can use the cart.
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        supabase.auth.signInAnonymously();
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
