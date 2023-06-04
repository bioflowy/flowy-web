import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const AuthOption:AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID??"",
      clientSecret: process.env.GITHUB_SECRET??""
    })
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

export default AuthOption