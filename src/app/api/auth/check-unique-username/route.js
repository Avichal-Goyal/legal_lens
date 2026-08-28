import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import UserModel from "@/lib/models/userModel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET (request) {

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const validationWithZod = UsernameQuerySchema.safeParse(queryParam)
        console.log(validationWithZod);
        if(!validationWithZod.success) {
            const validationErrors = validationWithZod.error.format().username?._errors ?? ["Invalid Username"];

            return NextResponse.json(
                {
                    success: false,
                    message: validationErrors.join(", "),
                },
                { status: 400 }
            );
        }

        await dbConnect();

        const {username} = validationWithZod.data

        const existingVerifiedUser = await User.findOne({ username, isVerified: true})

        if(existingVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: 'Username is already taken',
            }, {status: 200})
        }

        return NextResponse.json({
                success: true,
                message: 'Username is unique',
            }, {status: 200})
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