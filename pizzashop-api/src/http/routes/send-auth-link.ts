import Elysia, { t } from "elysia";
import { db } from "../../db";
import nodemailer from 'nodemailer'
import { authLinks, users } from "../../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { mail } from "../../lib/mail";
// import { env } from "../../env";

export const sendAuthLik = new Elysia().post(
    "/authenticate", 
    async ({ body }) => {
        const { email } = body

        const userFromEmail = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            }
        })

        if (!userFromEmail) {
            throw new Error('User not found.')
        }

        const authLinkCode = createId();
        await db.insert(authLinks).values({
            userId: userFromEmail.id,
            code: authLinkCode,
        })

        const authLink = new URL('/auth-links/authenticate', process.env.API_BASE_URL);

        authLink.searchParams.set('code', authLinkCode)
        authLink.searchParams.set('redirect', process.env.AUTH_REDIRECT_URL!)

        const info = await mail.sendMail({
            from: {
                name: 'Pizza Shop',
                address: 'hi@pizzashop.com'
            },
            to: email,
            subject: 'Authenticate to Pizza Shop',
            text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`
        })

        console.log(nodemailer.getTestMessageUrl(info))

}, {
    body: t.Object({
        email: t.String({ format: "email" })
    })
})