import { NextAuthOptions } from "next-auth";
import * as authHandler  from "@/app/api/auth/[...nextauth]/route";

const authOptions: NextAuthOptions = authHandler;

export { authOptions };
