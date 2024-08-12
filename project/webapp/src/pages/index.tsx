import App from "./app";
import type { GetServerSideProps } from 'next';

import { Category } from '../graphql/categories/schema';
import { Listing } from "../graphql/listing/schema";

// import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type StatProps = {
  categories: Category[],
  listings: Listing[],
}

import { CategoryService } from "../graphql/categories/service";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#getserversideprops-or-api-routes
  // Instead, directly import the logic used inside your API Route into getServerSideProps.
  // This could mean calling a CMS, database, or other API directly from inside getServerSideProps.
  const dataCategory = await new CategoryService().getCategories();
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common', 'footer', 'categories', 'login', 'signup'
      ])),
      categories: dataCategory,
    },
  }
}

export default function Index({categories}: StatProps) {
  return (
    <>
      <App 
        categories={categories}
      />
    </>
  )
}
