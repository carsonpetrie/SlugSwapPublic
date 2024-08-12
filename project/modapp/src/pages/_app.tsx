/*
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {useState, useEffect} from 'react';
import { UserSession } from '../graphql/auth/schema';
import { UserContext } from '../views/context';
import Footer from '../views/footer';

export default function App({ Component, pageProps }: AppProps) {
  const [loginDetails, setLoginDetails] = useState<UserSession|undefined>(undefined);

  useEffect(() => {
    const item = localStorage.getItem('user');
    if (item) {
      const user : UserSession = JSON.parse(item);
      setLoginDetails(user);
    }
  }, []);
  return(
    <UserContext.Provider value={{
      loginDetails: loginDetails, setLoginDetails: setLoginDetails,
    }}>
      <Component {...pageProps} />
      <Footer></Footer>
    </UserContext.Provider>
  );
}
