import { dbConnect } from '@/lib/mongodb';
import User from '@/lib/models/userModel';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';




export async function POST(request) {
    try {
        await dbConnect();
        const { username, email, password } = await request.json();

        const existingEmailUser = await User.findOne({ email });

        if (existingEmailUser) {
        return NextResponse.json(
            {
                error: "An account with this email already exists.",
                code: "EMAIL_EXISTS",
                redirectTo: "/userSetup/sign-in",
            },
            { status: 409 }
        );
        }

        const existingUsernameUser = await User.findOne({ username });

        if (existingUsernameUser) {
        return NextResponse.json(
            {
                error: "Username is already taken.",
                code: "USERNAME_EXISTS",
            },
            { status: 409 }
        );
        }


        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        return NextResponse.json(
            { message: 'Signup Successful' },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Error in signup route:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }


}