export default function HeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-(--gutter-top) -mt-(--gutter-top) md:mt-0">
      {children}
    </div>
  );
}
