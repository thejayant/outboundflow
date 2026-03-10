import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

export default function SignInPage() {
  return (
    <div className="grid gap-6">
      <AuthForm mode="sign-in" />
      <p className="text-center text-sm text-muted-foreground">
        New here? <Link href="/sign-up" className="text-primary">Create an account</Link>
      </p>
    </div>
  );
}
