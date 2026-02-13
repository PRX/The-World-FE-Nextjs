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
      <Image
        src={srcString}
        alt={altString}
        className={cn("rounded-md object-cover", className)}
        {...props}
      />
    );
  });
