'use client'
import { useSession } from "next-auth/react"

export default function UserPage() {
    const {data: session} = useSession();

    return <div>
        <p>{JSON.stringify(session?.user)}</p>
        <p>{JSON.stringify(session?.expires)}</p>
    </div>
}