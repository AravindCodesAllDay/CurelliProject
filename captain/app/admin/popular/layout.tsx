import React from "react";

export default function layout({
  children,
  addpopular,
}: Readonly<{
  children: React.ReactNode;
  addpopular: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      {addpopular}
    </div>
  );
}
