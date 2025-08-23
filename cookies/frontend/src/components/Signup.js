import { supabase } from "../supabaseClient";
import React, { Component } from "react";


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user: null,
      error: ""
    };
  }

  componentDidMount() {
    supabase.auth.getUser().then(({ data }) => {
      this.setState({ user: data?.user || null });
    });
    this.listener = supabase.auth.onAuthStateChange((_event, session) => {
      this.setState({ user: session?.user || null });
    });
  }

  componentWillUnmount() {
    if (this.listener) this.listener.subscription.unsubscribe();
  }

  handleSignIn = async (e) => {
    e.preventDefault();
    this.setState({ error: "" });
    const { error } = await supabase.auth.signInWithPassword({
      email: this.state.email,
      password: this.state.password
    });
    if (error) this.setState({ error: error.message });
    else {
      this.setState({ email: "", password: "" });
    }
  };

  handleSignUp = async (e) => {
    e.preventDefault();
    this.setState({ error: "" });
    const { error } = await supabase.auth.signUp({
      email: this.state.email,
      password: this.state.password
    });
    if (error) this.setState({ error: error.message });
    else {
      this.setState({ email: "", password: "" });
    }
  };

  handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  render() {
    const { email, password, user, error } = this.state;
    return (
      <div>
      
        <div style={{ margin: "2rem auto", maxWidth: 400 }}>
          {user ? (
            <>
              <span className="text-sm text-gray-700 mr-2">{user.email}</span>
              <button
                className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                onClick={this.handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <form className="flex flex-col gap-2" onSubmit={this.handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
                className="rounded-md border px-2 py-1"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
                className="rounded-md border px-2 py-1"
                required
              />
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm"
              >
                Login
              </button>
              <button
                type="button"
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-teal-600"
                onClick={this.handleSignUp}
              >
                Register
              </button>
              {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            </form>
          )}
        </div>
      </div>
    );
  }
}