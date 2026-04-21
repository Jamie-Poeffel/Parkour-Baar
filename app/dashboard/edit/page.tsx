import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getSiteData } from "@/lib/site-data"
import { EditClient } from "./EditClient"

export default async function EditPage() {
    const { userId } = await auth()
    if (!userId) redirect("/login")

    const data = await getSiteData()
    return <EditClient data={data} />
}
