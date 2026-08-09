type PhoneMockupProps = {
  channelName?: string;
  badge: string;
  title: string;
  body: string;
  ctaLabel: string;
};

export default function PhoneMockup({
  channelName = "너겟 세무사",
  badge,
  title,
  body,
  ctaLabel,
}: PhoneMockupProps) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-3 shadow-lg">
      <div className="overflow-hidden rounded-[1.5rem] bg-white">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-navy-950">{channelName}</span>
          <span className="text-xs text-gray-400">오후 8:00</span>
        </div>
        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-orange/80 to-brand-red/80 px-4 text-center text-xs font-semibold text-white">
          {badge}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-navy-950">{title}</h4>
          <p className="mt-2 line-clamp-4 text-sm text-gray-500">{body}</p>
          <button className="mt-4 w-full rounded-lg bg-brand-orange py-2 text-sm font-bold text-white">
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
