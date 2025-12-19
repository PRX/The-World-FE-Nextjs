import cn from "@/lib/util/css/cn";

export default function SegmentBrowser() {
  return (
    <div
      className={cn(
        "overflow-y-auto grid justify-stretch content-start gap-4 py-2",
      )}
    >
      <div className="grid place-items-center aspect-[8/9] p-3 rounded-md bg-background/10 backdrop-blur-sm backdrop-brightness-90">
        Calendar Input
      </div>
    </div>
  );
}
