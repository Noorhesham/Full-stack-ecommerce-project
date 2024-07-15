import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import AuthProvider from "./utils/SessionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./utils/QueryProvider";
import connect from "@/lib/database/connect";
const inter = Inter({ subsets: ["latin"] });

//todos
/* 
1.dashboard for seller 
2.products form {
product name ,price description stock ,brand subcategory categories and info  2images creator 
}
3.categories Gaming devices consoles computers 
4. admin dashboard (pending products , orders ,users)
5.
6.
7.
8.
9.
10.
*/
export const metadata = constructMetadata();
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connect();
  return (
    <html className="h-full " lang="en">
      <AuthProvider>
        <QueryProvider>
          <body className={cn("relative h-full font-sans antialiased", inter.className)}>
            <ToastContainer
              position="top-center"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              pauseOnHover={false}
              theme="light"
            />
            {children}
          </body>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}
