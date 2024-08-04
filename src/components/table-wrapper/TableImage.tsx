import React from "react";
import Image, { ImageProps } from "next/image";

interface TableImageProps extends ImageProps {
  className?: string;
}

const TableImage: React.FC<TableImageProps> = ({
  className,
  src,
  alt,
  title,
  placeholder,
  blurDataURL,
  priority = false,
}) => {
  return (
    <div
      className={`absolute right-4 top-[-78px] z-20 md:top-[-108px] lg:top-[-117px] ${
        className && className
      }`}
    >
      <div className="relative h-32 w-32 sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-48 lg:w-48">
        <Image
          fill
          priority={priority}
          src={src}
          alt={alt}
          title={title}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      </div>
    </div>
  );
};

export default TableImage;
