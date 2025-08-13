import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useEffect, useState } from 'react';
import { addFavourite, removeFavourite } from '@/lib/userData';

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null
  );

  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favourites.includes(String(objectID)));
  }, [favourites, objectID]);

  async function favouritesClicked() {
    try {
      if (showAdded) {
        const newList = await removeFavourite(objectID);
        setFavourites(newList || []);
        setShowAdded(false);
      } else {
        const newList = await addFavourite(objectID);
        setFavourites(newList || []);
        setShowAdded(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {data.objectDate || 'N/A'}<br />
          <strong>Classification:</strong> {data.classification || 'N/A'}<br />
          <strong>Medium:</strong> {data.medium || 'N/A'}<br /><br />
          <strong>Artist:</strong> {data.artistDisplayName || 'N/A'}<br />
          <strong>Credit Line:</strong> {data.creditLine || 'N/A'}<br />
          <strong>Dimensions:</strong> {data.dimensions || 'N/A'}<br /><br />
          <Button
            variant={showAdded ? 'primary' : 'outline-primary'}
            onClick={favouritesClicked}
          >
            {showAdded ? '+ Favourite (added)' : '+ Favourite'}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
