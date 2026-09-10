const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.bnp-coorporation.com/graphql";

export async function fetchAPI<TData = any, TVariables = any>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error(
      `GraphQL API Error: ${json.errors[0]?.message || "Unknown error"}`,
    );
  }

  return json.data;
}
