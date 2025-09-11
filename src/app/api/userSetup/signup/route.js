import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/userModel';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';




export async function POST(request) {
    try {
        await dbConnect();
        const { username, email, password } = await request.json();

        const existedUser = await User.findOne({email});
        if(existedUser){
            return NextResponse.json(
                { error: 'Redirecting to login...' , redirect: '/login' },
                { status: 400 } // not an error anymore
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
        console.error('Error in signup route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }


}