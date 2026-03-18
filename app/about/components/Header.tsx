"use server";

import { Playfair_Display } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

const Header = () => (
  <header className="flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <Link
        href="/"
        aria-label="Go to home"
        className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Image
          src="/logo/mp_logo_icon.svg"
          alt="Master Picker logo"
          width={50}
          height={50}
        />
      </Link>
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">About</Badge>
        <h1
          className={`text-3xl tracking-tight sm:text-4xl md:text-5xl ${playfair.className}`}
        >
          Master Picker
        </h1>
      </div>
    </div>
    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
      Master Picker helps LiU students compare master programs, understand
      requirements, and plan courses without getting lost in spreadsheets.
    </p>
  </header>
);

export default Header;
