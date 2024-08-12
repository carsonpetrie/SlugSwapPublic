import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {useState, useEffect} from 'react';
import { UserSession } from '../graphql/auth/schema';
import { UserContext, CategoryContext, SearchContext, RouteContext } from '../views/context';
import Footer from '../views/footer';
import homeTheme from '@/styles/theme';
import { ThemeProvider } from '@mui/material';

import { appWithTranslation } from 'next-i18next';
import { RouteInfo } from '../types/custom';

function App({ Component, pageProps }: AppProps) {
  const [loginDetails, setLoginDetails] = useState<UserSession|undefined>(undefined);
  const [currentCategory, setCurrentCategory] = useState<string>('All');
  const [currentSearch, setCurrentSearch] = useState<string|undefined>(undefined);
  const [currentRoute, setCurrentRoute] = useState<RouteInfo>({pathname: '/', query: {}});


  useEffect(() => {
    const item = localStorage.getItem('user');
    if (item) {
      const user : UserSession = JSON.parse(item);
      setLoginDetails(user);
    }
  }, []);
  return(
    <ThemeProvider theme={homeTheme}>
      <RouteContext.Provider value={{
        currentRoute: currentRoute, setCurrentRoute: setCurrentRoute
      }}>
        <UserContext.Provider value={{
          loginDetails: loginDetails, setLoginDetails: setLoginDetails,
        }}>
          <CategoryContext.Provider value={{
            currentCategory: currentCategory, setCurrentCategory: setCurrentCategory
          }}>
            <SearchContext.Provider value = {{
              currentSearch: currentSearch, setCurrentSearch: setCurrentSearch
            }}>
              <Component {...pageProps} />
              <Footer/>
            </SearchContext.Provider>
          </CategoryContext.Provider>
        </UserContext.Provider>
      </RouteContext.Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);