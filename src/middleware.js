import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Allow everyone to access the home page
      if (req.nextUrl.pathname === "/") return true;
      return !!token; // Redirect if not logged in
    },
  },
});
