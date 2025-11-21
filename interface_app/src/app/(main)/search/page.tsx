"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchInterface from "@/components/SearchInterface";
import { Loader2 } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tìm kiếm
            </h1>
            <p className="text-muted-foreground">
              Tìm kiếm người dùng, bài đăng và nội dung khác
            </p>
          </div>

          {/* Search Interface */}
          <SearchInterface initialQuery={query} />
        </div>
      </div>
    </div>
  );
}

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Đang tải...</span>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}
