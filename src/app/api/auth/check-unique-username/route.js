import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET (request) {
    // if(request.method !== 'GET') {
    //     return NextResponse.json({
    //         success: false,
    //         message: 'only GET method is allowed.',
    //     }, {status: 405})
    // } now its not required
    await connectToDatabase();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
            }, {status: 400})
        }

        const {username} = result.data

        const existingVerifiedUser = await User.findOne({ username, isVerified: true})

        if(existingVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: 'Username is already taken',
            }, {status: 400})
        }

        return NextResponse.json({
                success: true,
                message: 'Username is unique',
            }, {status: 400})
    } catch (error) {
        console.error("Error checking username:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500
            }
        )
    }
}