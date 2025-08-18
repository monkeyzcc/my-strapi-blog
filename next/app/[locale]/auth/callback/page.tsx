"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const jwt = searchParams.get("jwt") || searchParams.get("access_token");
    const redirect = searchParams.get("redirect") || "/";
    if (jwt) {
      document.cookie = `strapi_jwt=${jwt}; Path=/; Max-Age=2592000; SameSite=Lax`;
    }
    router.replace(redirect);
  }, [router, searchParams]);

  return null;
}

