import React from "react";

const Homelayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <html lang="en">
        <body>{children}</body>
      </html>
    </>
  );
};

export default Homelayout;
