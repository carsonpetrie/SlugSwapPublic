import Home from '../views/home';


import { Category } from '../graphql/categories/schema';

type AppProps = {
  categories: Category[],
}

export default function App({categories}: AppProps) {

  return (
    <>
      <Home categories={categories}/>
    </>
  )
}