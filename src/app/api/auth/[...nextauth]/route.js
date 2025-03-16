import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const { name, email, password } = credentials;
        if (!email || !password) throw new Error("Missing email or password");

        let user = await User.findOne({ email });

        if (!user) {
          if (!name) throw new Error("Name is required for new users");

          const hashedPassword = await bcrypt.hash(password, 10);
          user = await User.create({ name, email, password: hashedPassword });
        } else {
          if (!user.password) throw new Error("Please sign in with Google");

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error("Invalid credentials");
        }

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
    
      if (account.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });
    
        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            isGoogleUser: true,
          });
        }
    
        user.id = existingUser._id; // ✅ Store MongoDB _id in user object
      }
    
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ✅ Ensure token contains MongoDB _id
        token.name = user.name;
        token.email = user.email;
      } else {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id; // ✅ Fetch MongoDB _id from database
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id; // ✅ Store MongoDB _id in session
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
