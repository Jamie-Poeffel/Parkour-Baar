import { requirePermission } from "@/lib/auth";
import { getSiteData } from "@/utils/site-data";
import { EditClient } from "./EditClient";

export default async function EditPage() {
  await requirePermission("dashboard:edit");

  const data = await getSiteData();
  return <EditClient data={data} />;
}
