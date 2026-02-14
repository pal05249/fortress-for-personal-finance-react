
type FortressMapProps = {
  location?: string;
  size?: number;
};

export default function FortressMap({ location = "Unknown", size = 160 }: FortressMapProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center border rounded-md bg-white text-sm text-gray-600"
      title={location}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="10" rx="1" stroke="#4B5563" strokeWidth="1.2" fill="#F3F4F6" />
        <path d="M7 7V5h2v2" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7V5h2v2" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1" fill="#111827" />
      </svg>
      <div className="sr-only">Map: {location}</div>
    </div>
  );
}
