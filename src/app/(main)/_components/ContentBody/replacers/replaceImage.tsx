import { attributesToProps } from "html-react-parser";
import { replaceElement } from "./replaceElement";
import Image from "next/image";
import { sanitizeUrl } from "@/lib/parse/url";
import { cn } from "@/lib/utils";

export const replaceImage = (
  overrideProps?: Partial<React.ComponentProps<typeof Image>>,
) =>
  replaceElement("img", (el) => {
    const { attribs } = el;
    const { src, alt, ...imgProps } = attributesToProps(attribs);

    if (!src) {
      // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
      return <></>;
    }

    delete imgProps.className;

    const altString = typeof alt === "string" ? alt : "";
    const srcString = typeof src === "string" ? sanitizeUrl(src) : "";
    const { className, ...props } = {
      ...imgProps,
      ...overrideProps,
    };

    props.width = props.width || "400";
    props.height = props.height || "300";

    return (
      <span
        className={cn(
          "relative inline-block overflow-clip rounded-md",
          "bg-navy-blue/30 backdrop-blur-lg dark:bg-blue/30 light:bg-blue",
          "before:absolute before:inset-0 before:z-0 before:bg-linear-to-tl before:from-purple before:to-purple/0",
          "after:absolute after:inset-0 after:z-0 after:bg-linear-to-tr after:from-green after:to-green/0 after:to-40%",
        )}
      >
        <Image
          src={srcString}
          alt={altString}
          className={cn("relative z-1 object-cover", className)}
          {...props}
        />
      </span>
    );
  });
