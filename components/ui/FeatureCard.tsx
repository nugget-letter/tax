type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold text-navy-950">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}
