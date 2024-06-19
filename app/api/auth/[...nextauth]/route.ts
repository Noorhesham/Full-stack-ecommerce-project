import NextAuth from "next-auth";
import User from "@/lib/database/models/UserModel";
import bcrypt from "bcrypt";
import connect from "@/lib/database/connect";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { sendConfirmationEmail, sendWelcomeEmail } from "@/lib/database/email";

const authHandler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const { email, password } = credentials;
          await connect();
          const user = await User.findOne({ email }).select("+password");
          if (!user) throw new Error("No user found with this email");
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) throw new Error("Incorrect password");
          if (user&&!user.isActivated) throw new Error("Please activate your account");
          console.log(isValidPassword, user);
          return user;
        } catch (error:any) {
          throw new Error(error.message);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      console.log(token, user);
      if (user) {
        token.user = {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          photo: user.photo,
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
    //@ts-ignore
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      await connect();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = await User.create({
          email: user.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          photo: profile.picture,
          role: "user",
          password: null,
          isthirdParty: account.provider === "google",
          isActivated: account.provider === "google" ? true : false, 
        });
        // console.log(newUser.toObject(),"newuser");
        // if(account.provider==='google') return true
        // sendConfirmationEmail(newUser.toObject().email);
      }
      return true;
    },
  },
  events: {
    
  },
});

export { authHandler as GET, authHandler as POST };
