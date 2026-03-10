import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

export default function SignUpPage() {
  return (
    <div className="grid gap-6">
      <AuthForm mode="sign-up" />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/sign-in" className="text-primary">Sign in</Link>
      </p>
    </div>
  );
}
