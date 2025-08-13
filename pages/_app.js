// my-app/pages/_app.js
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { SWRConfig } from 'swr';
import 'bootstrap/dist/css/bootstrap.min.css';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{
      fetcher: async url => {
        const res = await fetch(url);
        if (!res.ok) {
          const error = new Error('An error occurred while fetching the data.');
          try { error.info = await res.json(); } catch { /* ignore */ }
          error.status = res.status;
          throw error;
        }
        return res.json();
      }
    }}>
      <Layout>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Layout>
    </SWRConfig>
  );
}
