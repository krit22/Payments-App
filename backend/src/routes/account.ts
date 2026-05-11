import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { prisma } from "../db"
import { z } from "zod"

const transferSchema = z.object({
    toAccountId: z.number(),
    amount: z.number().positive()
});

export const accountRouter = Router()

accountRouter.get("/", authMiddleware, async (req, res) => {


    const accounts = await prisma.account.findMany({
        where: {
            userId: req.body.userId
        }
    });

    res.json({
        totalAccounts: accounts.length,
        accounts
    })
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const result = transferSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({
            message: "Could not transfer",
            error: "Input valudation failed"
        })
        return
    }

    const { toAccountId, amount } = transferSchema.parse(req.body);
    const fromUserId = req.body.userId;

    try {
        await prisma.$transaction(async (tx) => {

            const fromAccount = await tx.account.findFirst({
                where: {
                    userId: fromUserId
                }
            })

            if (!fromAccount || fromAccount.balance < amount) {
                throw new Error("Insuccient balance")
            }

            const toAccount = await tx.account.findFirst({
                where: {
                    id: toAccountId
                }
            })

            if (!toAccount) {
                throw new Error("Receiver account not found")
            }

            //deduct from sender
            await tx.account.update({
                where: {
                    id: fromAccount.id
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });

            //increment to receiver
            await tx.account.update({
                where: {
                    id: toAccount.id
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });

        })

        res.status(200).json({
            message: "Transfer successful"
        });
    } catch (e) {
        res.status(400).json({ message: "Transfer failed", e });
    }
})