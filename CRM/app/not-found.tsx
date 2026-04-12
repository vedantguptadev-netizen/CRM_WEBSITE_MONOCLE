"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-red-50 via-white to-slate-50 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-9xl font-bold text-red-600">404</h1>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
