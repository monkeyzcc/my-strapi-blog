import { Metadata } from 'next';
import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import ClientSlugHandler from '../ClientSlugHandler';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: params.slug,
      },
      populate: "seo.metaImage",
    },
    true,
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Page({ params }: { params: { locale: string, slug: string } }) {
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: params.slug,
      },
    },
    true,
  );

  return (
    <>
      <PageContent pageData={pageData} />
    </>

  );
}