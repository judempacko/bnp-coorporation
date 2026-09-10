import { fetchAPI } from './wp-graphql';

export interface PostNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  } | null;
  author?: {
    node?: {
      name: string;
    };
  } | null;
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
}

export const GET_ALL_POSTS_QUERY = /* GraphQL */ `
  query GetAllPosts {
    posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG_QUERY = /* GraphQL */ `
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export async function getAllPosts(): Promise<PostNode[]> {
  try {
    const data = await fetchAPI(GET_ALL_POSTS_QUERY);
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostNode | null> {
  try {
    const data = await fetchAPI(GET_POST_BY_SLUG_QUERY, { id: slug });
    return data?.post || null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}
