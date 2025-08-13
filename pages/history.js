// my-app/pages/history.js
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { Card, Button, ListGroup, Container } from 'react-bootstrap';
import styles from '@/styles/History.module.css';
import { getHistory, removeHistory } from '@/lib/userData';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';

export default function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // Load history từ DB nếu đã login
  useEffect(() => {
    (async () => {
      if (isAuthenticated()) {
        try {
          const data = await getHistory();
          setSearchHistory(data || []);
        } catch {
          // ignore; giữ state hiện tại
        }
      }
    })();
  }, [setSearchHistory]);

  const parsedHistory = searchHistory.map(h => {
    const params = new URLSearchParams(h);
    return Object.fromEntries(params.entries());
  });

  function historyClicked(e, index) {
    const qs = searchHistory[index];
    router.push(`/artwork?${qs}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    const qs = searchHistory[index];
    try {
      const updated = await removeHistory(qs); // xoá DB
      setSearchHistory(updated || []);
    } catch {
      // fallback local
      setSearchHistory(current => {
        const copy = [...current];
        copy.splice(index, 1);
        return copy;
      });
    }
  }

  return (
    <Container className="mt-4">
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for some artwork.</p>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((item, idx) => (
            <ListGroup.Item
              key={idx}
              className={styles.historyListItem}
              onClick={e => historyClicked(e, idx)}
            >
              {Object.keys(item).map(key => (
                <span key={key}>
                  {key}: <strong>{item[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={e => removeHistoryClicked(e, idx)}
              >&times;</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
