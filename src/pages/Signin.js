
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form,  Button, FormCheck, Container, InputGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import BgImage from "../assets/img/illustrations/signin.svg";
import { useForm } from "react-hook-form";
import { postAPIData } from "../utils/getAPIData";
import { toast } from "react-toastify";

export default () => {
  const {
    register,
    handleSubmit
  } = useForm();
  const navigate = useNavigate();

  const handleLogin = async (Values) => {
    let { data, error, status } = await postAPIData('/login', Values);
    if (!error) {
      localStorage.setItem('token', data.token)
      toast.success("Login Successful!", { position: "top-center", autoClose: 2500 })
      navigate('/dashboard');
    }
    else {
      if (status === 400) {
        toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
      } else {
        toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
      }
    }
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div>
                <Form className="mt-4 mb-4" onSubmit={handleSubmit(handleLogin)}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="example@company.com" {...register('email')} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password" {...register('password')} />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-4">
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
