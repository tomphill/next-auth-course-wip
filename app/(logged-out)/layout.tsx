import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log({ session });

  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return children;
}
