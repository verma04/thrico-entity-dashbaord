import { redirect } from "next/navigation";

export default function RolesAllRedirectPage() {
  redirect("/settings/users/roles");
}
