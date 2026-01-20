import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "@/db/connectDb";
import User from "@/models/users";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                userId: { label: "User ID", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                await connectDb();

                try {
                    const user = await User.findOne({ id: credentials.userId });

                    if (!user) {
                        throw new Error("No user found with this User ID");
                    }

                    // Simple password check bycrypt used for hashed password check
                    if (user.password !== credentials.password) {
                        throw new Error("Invalid password");
                    }

                    // Verify role
                    if (credentials.role && user.role !== credentials.role) {
                        throw new Error("Invalid role for this user");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.userId,
                        role: user.role
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    }
});

export { handler as GET, handler as POST };
