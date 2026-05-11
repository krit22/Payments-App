import { Router } from "express";
import { string, z } from "zod"
import bcrypt from "bcryptjs";
import { prisma } from "./../db"
import jwt from "jsonwebtoken"


const userRouter = Router();

const userSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
})

const signInSchema = z.object({
    username: z.string().email(),
    password: string().min(6)
})

userRouter.post("/signup", async (req, res) => {
    const result = userSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({
            message: "Invalid input format"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(
        result.data.password,
        3
    );

    try {
        const user = await prisma.user.create({
            data: {
                username: result.data.username,
                password: hashedPassword,
                firstName: result.data.firstName,
                lastName: result.data.lastName
            }
        })

        const account = await prisma.account.create({
            data: {
                balance: Math.floor(Math.random() * 10000),
                userId: user.id
            }
        });


        res.status(200).json({
            message: "Create the user successfully",
            userId: user.id,
            balance: account.balance
        })


    } catch (error) {
        res.status(400).json({
            message: "could not signup",
            error
        })
    }


})

userRouter.post("/signin", async (req, res) => {
    console.log("Login request received..")
    const result = signInSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Login failed",
            error: "Incorrect input type"
        })
        console.log("Invalid input type...")
        return
    }


    const user = await prisma.user.findUnique({
        where: {
            username: result.data.username
        }
    })

    if (!user) {
        res.status(400).json({
            message: "Login failed",
            error: "User not found"
        })
        console.log("user not found..")
        return
    }

    console.log("User found..")
    const passwordMatch = await bcrypt.compare(result.data.password, user.password);

    if (!passwordMatch) {
        res.status(400).json({
            message: "Signin Failed",
            error: "Incorrect password"
        })
        console.log("Inorrect password")
        return
    }

    console.log("Password verified..")

    const token = jwt.sign({
        userId: user.id
    }, process.env.JWT_SECRET as string)

    res.json({
        message: "Login successful",
        token
    })

    console.log("Returned the JWT")

})



export default userRouter;