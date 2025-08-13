import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import ArtworkCard from '@/components/ArtworkCard';
import { Row, Col, Card, Container } from 'react-bootstrap';

export default function Favourites() {

  const [favoritesList] = useAtom(favouritesAtom);

  return (
    <Container className="mt-4">
      {favoritesList.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try adding some new artwork to the list.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="gy-4">
          {favoritesList.map(objectID => (
            <Col lg={3} md={4} sm={6} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
