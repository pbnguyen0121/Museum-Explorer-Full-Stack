import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { addHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

export default function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function submitForm(data) {
    let queryString = `${data.searchBy}=true`;
    if (data.geoLocation)   queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium)        queryString += `&medium=${data.medium}`;
                            queryString += `&isOnView=${data.isOnView}`;
                            queryString += `&isHighlight=${data.isHighlight}`;
                            queryString += `&q=${data.q}`;

    try {
      if (isAuthenticated()) {
        const updated = await addHistory(queryString);
        setSearchHistory(updated || []);
      } else {
        setSearchHistory(current => [...current, queryString]);
      }
    } catch {
      setSearchHistory(current => [...current, queryString]);
    }

    router.push(`/artwork?${queryString}`);
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Advanced Search</h2>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Search Query</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                {...register("q", { required: true })}
                className={errors.q ? "is-invalid" : ""}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register("searchBy")} className="mb-3">
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Geo Location</Form.Label>
              <Form.Control type="text" placeholder="" {...register("geoLocation")} />
              <Form.Text className="text-muted">
                Case Sensitive (e.g. "Europe", "France", "Paris"), multiple values separated by |
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Medium</Form.Label>
              <Form.Control type="text" placeholder="" {...register("medium")} />
              <Form.Text className="text-muted">
                Case Sensitive (e.g. "Ceramics", "Paintings"), multiple values separated by |
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Check type="checkbox" label="Highlighted" {...register("isHighlight")} />
            <Form.Check type="checkbox" label="Currently on View" {...register("isOnView")} />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <Button variant="primary" type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
