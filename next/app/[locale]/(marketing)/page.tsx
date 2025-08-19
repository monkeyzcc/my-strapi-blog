import { Metadata } from 'next';

import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { BlogPostRows } from '@/components/blog-post-rows';
import { StrapiImage } from '@/components/ui/strapi-image';
import { Link } from 'next-view-transitions';

export async function generateMetadata(): Promise<Metadata> {

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: "homepage",
      },
      populate: "seo.metaImage",
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function HomePage() {
  const pageData = await fetchContentType('pages', { filters: { slug: 'homepage' }, populate: 'seo.metaImage' }, true);
  const articles = await fetchContentType('articles', { sort: ['views:desc'] }, false);
  const products = await fetchContentType('products', {}, false);

  return (
    <div className="relative overflow-hidden w-full">
      <Container className="pt-40 pb-20">
        <Heading as="h1">热门资源</Heading>
        <Subheading className="max-w-3xl">按浏览量排序的资源分享文章</Subheading>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <BlogPostRows articles={articles?.data || []} />
          </div>
          <aside className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4">商品</h3>
            <div className="space-y-6">
              {(products?.data || []).slice(0, 6).map((product: any) => (
                <Link key={product.slug} href={`/zh/products/${product.slug}`} className="flex items-center gap-4 group">
                  <div className="h-16 w-16 rounded-md overflow-hidden border border-neutral-800">
                    <StrapiImage src={product?.images?.[0]?.url} alt={product.name} width={64} height={64} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white group-hover:underline">{product.name}</p>
                    <p className="text-neutral-400 text-sm">￥{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
