import React from "react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="bg-green-700 w-11/12 md:w-5/6 my-3 mx-auto h-40 md:h-60 flex flex-col justify-center items-center gap-3 rounded">
      <h3 className="text-white text-xl md:text-5xl">{title}</h3>
    </div>
  );
}
