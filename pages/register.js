// my-app/pages/register.js
import { useForm } from "react-hook-form";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  async function onSubmit(data) {
    setServerError("");
    try {
      await registerUser(data.userName, data.password, data.password2);
      router.push("/login"); // theo yêu cầu A6
    } catch (err) {
      setServerError(err.message || "Register failed");
    }
  }

  return (
    <Row className="justify-content-center mt-4">
      <Col md={6} lg={5}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Register</Card.Title>

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

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password2", {
                    required: "Confirm your password",
                    validate: (v) => v === watch("password") || "Passwords do not match"
                  })}
                  isInvalid={!!errors.password2}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">Create Account</Button>
                <Button variant="secondary" onClick={() => router.push("/login")}>
                  Back to Login
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
