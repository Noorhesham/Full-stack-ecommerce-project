import NextAuth, { AuthOptions } from "next-auth";
import User from "@/lib/database/models/UserModel";
import bcrypt from "bcrypt";
import connect from "@/lib/database/connect";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const { email, password } = credentials;
          await connect();
          const user = await User.findOne({ email }).select("+password +isAdmin");
          if (!user) throw new Error("No user found with this email");
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) throw new Error("Incorrect password");
          if (user && !user.isActivated) throw new Error("Please activate your account");
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            photo: user.photo || user.image,
            isAdmin: user.isAdmin || false,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          photo: profile.picture,
          role: "user",
          isAdmin: false, // default value for Google login
        };
      },
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
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          photo: user.photo,
          isAdmin: user.isAdmin,
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
          phoneNumber: profile.phone_number || null,
          isthirdParty: account.provider === "google",
          isActivated: account.provider === "google" ? true : false,
          isAdmin: false, // default value for new users via Google
        });
        user.id = newUser._id;
        user.isAdmin = newUser.isAdmin;
      } else {
        user.id = existingUser._id;
        user.isAdmin = existingUser.isAdmin;
      }
      return true;
    },
  },
  events: {},
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
