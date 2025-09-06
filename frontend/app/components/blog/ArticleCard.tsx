import Link from 'next/link';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function ArticleCard({ slug, title, description, imageUrl }: ArticleCardProps) {
  return (
    <Link href={`/artigos/${slug}`} className="block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative">
        <img
          alt={title}
          src={imageUrl}
          className="h-56 w-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </Link>
  );
}