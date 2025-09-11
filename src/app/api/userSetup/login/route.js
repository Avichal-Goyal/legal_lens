import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/userModel';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json(
                { error: "No user found with this email" },
                { status: 404 }
            );
        }

        //verifying password
        const validatePassword = await bcryptjs.compare(password, user.password);
        if (!validatePassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }

        //creating token
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"});

        const response = NextResponse.json({
            message: "Login Successful",
            success: true
        });
        response.cookies.set("token", token,{
            httpOnly: true,
        })

        return response;

    } catch(err) {
        return NextResponse.json({
            error: "Login unsuccessfull",
            status: 500
        })
    }
}