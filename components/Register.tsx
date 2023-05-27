import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import registerPush from "../lib/register"

export default function RegisterPage({
    vapidPublicKey
}) {
    registerPush(vapidPublicKey)
    return (
        <></>
    )
}

