import Search from "@/components/Search";
import React from "react";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Tìm kiếm người dùng
            </h1>
            <p className="text-muted-foreground">
              Tìm và kết nối với bạn bè trên nền tảng của chúng tôi
            </p>
          </div>

          <Search />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
