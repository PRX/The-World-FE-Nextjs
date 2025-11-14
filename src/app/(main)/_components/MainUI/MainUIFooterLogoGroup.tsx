export default function MainUIFooterLogoGroup({
  heading,
  children,
}: {
  heading?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className="grid justify-items-center content-start gap-y-5 w-fit">
      {heading && <h2 className="font-bold uppercase">{heading}</h2>}
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 [&_svg]:max-w-70 [&_svg]:h-12">
        {children}
      </div>
    </aside>
  );
}
