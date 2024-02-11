import React from "react";
import Image, { ImageProps } from "next/image";

interface TableImageProps extends ImageProps {
  className?: string;
}

const TableImage: React.FC<TableImageProps> = ({
  className,
  width,
  height,
  src,
  alt,
  title,
  placeholder,
  blurDataURL,
}) => {
  return (
    <div className={`absolute right-4 top-[-131px] ${className}`}>
      <Image
        className=""
        width={width}
        height={height}
        src={src}
        alt={alt}
        title={title}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    </div>
  );
};

export default TableImage;
