import { useForm } from "react-hook-form";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticateUser, isAuthenticated } from "@/lib/authenticate";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) router.replace('/favourites');
  }, []);

  async function onSubmit(data) {
    setServerError("");
    try {
      await authenticateUser(data.userName, data.password);
      await router.replace("/favourites");
    } catch (err) {
      setServerError(err.message || "Login failed");
    }
  }

  return (
    <Row className="justify-content-center mt-4">
      <Col md={6} lg={5}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Login</Card.Title>
            {serverError ? <Alert variant="danger">{serverError}</Alert> : null}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("userName", { required: "User Name is required" })}
                  isInvalid={!!errors.userName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userName?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">Login</Button>
                <Button variant="secondary" onClick={() => router.push("/register")}>
                  Go to Register
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
