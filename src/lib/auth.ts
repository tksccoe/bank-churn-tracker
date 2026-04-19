import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from './mongodb';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        // Read isAdmin from the users collection on first sign-in
        await connectDB();
        const db = mongoose.connection.db!;
        const dbUser = await db
          .collection('users')
          .findOne({ _id: new mongoose.Types.ObjectId(user.id) });
        token.isAdmin = dbUser?.isAdmin === true;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id;
      session.user.isAdmin = token.isAdmin ?? false;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
