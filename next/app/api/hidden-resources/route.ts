import { cookies } from "next/headers";
import qs from "qs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale");
  if (!slug || !locale) {
    return new Response(JSON.stringify({ error: "Missing slug or locale" }), { status: 400 });
  }

  const jwt = cookies().get('strapi_jwt')?.value;
  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(`api/articles`, process.env.NEXT_PUBLIC_API_URL);
  const query = qs.stringify({
    filters: { slug, locale },
    populate: {
      dynamic_zone: {
        populate: {
          links: true
        }
      }
    }
  });

  const res = await fetch(`${url.toString()}?${query}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
  const json = await res.json();
  const data = Array.isArray(json.data) ? json.data[0] : json.data;
  const dz = data?.dynamic_zone || [];
  const block = dz.find((b: any) => b.__component === 'dynamic-zone.hidden-resources');
  const links = block?.links || [];
  return new Response(JSON.stringify({ links }), { status: 200 });
}