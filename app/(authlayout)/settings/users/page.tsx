import { redirect } from "next/navigation";

export default function UsersRootPage() {
  redirect("/settings/users/all");
}
