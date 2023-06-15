import { Provider } from 'react-redux';

import '@/styles/globals.css';
import '@/styles/auth.css';

import { store } from '@/Redux/store';
/**
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
