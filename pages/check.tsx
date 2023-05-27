import dynamic from "next/dynamic";

const RegisterPage = dynamic(()=>import("../components/Register"), {ssr: false})


export default function Register({vapidPublicKey}){
    return <RegisterPage vapidPublicKey={vapidPublicKey} />
}

export async function getServerSideProps() {
    return {
			props: {
				vapidPublicKey: process.env.PUBLIC_VAPID_KEY,
			},
		};
}