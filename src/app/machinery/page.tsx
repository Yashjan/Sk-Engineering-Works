"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const machineryShowcase = "/salt-refinery-plants#machinery-showcase-title";

export default function MachineryRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace(machineryShowcase);
  }, [router]);

  return null;
}
