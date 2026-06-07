import Link from "next/link";

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="SPOTTED home"
      className="group inline-flex items-end gap-1"
    >
      <span
        className={`font-semibold leading-none tracking-[-0.08em] text-black ${
          compact ? "text-[18px]" : "text-[22px]"
        }`}
      >
        SPOTTED
      </span>

      <span className="mb-[2px] size-[6px] rounded-full bg-[var(--accent-strong)] transition-transform duration-300 group-hover:scale-150" />
    </Link>
  );
}
