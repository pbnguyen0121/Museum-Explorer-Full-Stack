// my-app/components/RouteGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavourites] = useAtom(favouritesAtom);
  const [, setHistory] = useAtom(searchHistoryAtom);
  const [hydrated, setHydrated] = useState(false);

  const publicPaths = ['/', '/login', '/register', '/search', '/artwork'];

  function isPublic(path) {
    return publicPaths.includes(path) || path.startsWith('/artwork/');
  }

  async function authCheck(url) {
    const path = url.split('?')[0];

    // chưa đăng nhập mà truy cập trang bảo vệ -> về /login
    if (!isPublic(path) && !isAuthenticated()) {
      setAuthorized(false);
      router.replace('/login');
      return;
    }

    // đã đăng nhập mà còn ở /login -> sang /favourites
    if (path === '/login' && isAuthenticated()) {
      setAuthorized(false);
      router.replace('/favourites');
      return;
    }

    setAuthorized(true);

    // sau khi đăng nhập, chỉ nạp DB 1 lần
    if (isAuthenticated() && !hydrated) {
      try {
        const [favs, hist] = await Promise.all([getFavourites(), getHistory()]);
        setFavourites(favs || []);
        setHistory(hist || []);
      } catch {
        /* ignore */
      } finally {
        setHydrated(true);
      }
    }
  }

  useEffect(() => {
    authCheck(router.asPath);
    const hide = () => setAuthorized(false);
    router.events.on('routeChangeStart', hide);
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeStart', hide);
      router.events.off('routeChangeComplete', authCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authorized ? children : null;
}
