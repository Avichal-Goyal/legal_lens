// lib/auth.js (or wherever you define this)

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "./mongodb";
import User from "./models/userModel";
import bcrypt from "bcryptjs";


export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        console.log("No user found");
                        return null;
                    }

                    //Check if user has a password
                    if (!user.password) {
                        console.log("User has no password (OAuth user)");
                        return null;
                    }


                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    console.log("Credentials login successful");
                    // Return the full user object for the jwt callback
                    return user;

                } catch (error) {
                    console.error("Credentials authorization error: ", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        /**
         * Saves Google users to your database.
         */
        async signIn({ account, profile }) {
            await dbConnect();

            if (account?.provider === "google") {
                if (!profile?.email) {
                    console.error("Google profile missing email");
                    return false; // Prevent sign-in
                }
                try {
                    // Check if user exists
                    const userExists = await User.findOne({ email: profile.email });

                    if (!userExists) {
                        console.log("Google user not found in DB, redirecting to register.");
                        // Redirect to registration page
                        return "*/app/userSetup/sign-up"; // Prevent sign-in for new Google users
                    }

                    // If user exists, update their info (optional, but good practice)
                    await User.updateOne(
                        { email: profile.email },
                        {
                            $set: {
                                name: profile.name,
                            },
                        }
                    );
                    return true;

                } catch (error) {
                    console.error("Google sign-in check error:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.isVerified = dbUser.isVerified;
                    token.isAcceptingMessages = dbUser.isAcceptingMessages;
                    token.name = dbUser.name;
                }
            }
            return token;
        },


        /**
         * Safer session update
         */
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/userSetup/sign-in",
        error: "/userSetup/sign-in",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
};