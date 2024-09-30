import Image, { StaticImageData } from "next/image";

export default function Placeholder({
  photo,
  header,
}: {
  photo: StaticImageData;
  header: string;
}) {
  return (
    <div>
      <header className="py-4 md:py-8 flex justify-center items-center">
        <div className="md:flex md:items-center md:w-2/3 rounded-md shadow-md bg-[#277933]">
          <Image
            src={photo}
            alt="Profile"
            className="w-24 h-24 md:w-40 md:h-40 my-4 md:my-0 p-6"
          />
          <h2 className="text-3xl font-semibold text-white">{header}</h2>
        </div>
      </header>
    </div>
  );
}
