import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap'
import downloadWebpage from './logic.js'

function App() {
  const [inputs, setInputs] = useState({name: "Example", link: "https://example.com", iterations: 2, extend: "Limitless", adjustPage: true, login: false});

  const updateName = (e) => {
    setInputs(inputs => ({ ...inputs, name: e.target.value }));
  }
  const updateLink = (e) => {
    setInputs(inputs => ({ ...inputs, link: e.target.value }));
  }
  const updateIterations = (e) => {
    setInputs(inputs => ({ ...inputs, iterations: e.target.value }));
  }
  const updateExtend = (e) => {
    setInputs(inputs => ({ ...inputs, extend: e.target.value}));
  }
  const updateAdjustPage = (e) => {
    setInputs(inputs => ({ ...inputs, adjustPage: !inputs.adjustPage}));
  }
  const updateLogin = (e) => {
    setInputs(inputs => ({ ...inputs, login: !inputs.login}));
  }
  const updateUsername = (e) => {
    setInputs(inputs => ({ ...inputs, username: e.target.value }));
  }
  const updatePassword = (e) => {
    setInputs(inputs => ({ ...inputs, password: e.target.value }));
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(inputs)
    downloadWebpage(inputs.name, inputs.link, inputs.iterations, inputs.extend, inputs.adjustPage)
  }
  return (
      <Container>
        <Row className="mt-3 justify-content-center">
          <Col sm={12} md={10} lg={10}>
            <h1 className="mt-2 text-center fs-1">WebDownload</h1>
          </Col>
        </Row>
        <Row className="justify-content-center text-start fs-5">
          <Col sm={12} md={10} lg={10}>
            <Form>
            <Row>
                <Col sm={12}>
                <Form.Group controlId="link" className="mb-2">
                  <Form.Label>Website Link</Form.Label>
                  <Form.Control size="sm" onChange={updateLink} placeholder="https://example.com" type="text"></Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={9} lg={9}>
                <Form.Group controlId="name" className="mb-2">
                  <Form.Label>Filename</Form.Label>
                  <Form.Control size="sm" onChange={updateName} placeholder="Example" type="text"></Form.Control>
                </Form.Group>
                </Col>
                <Col sm={12} md={3} lg={3}>
                <Form.Group controlId="iterations" className="mb-2">
                  <Form.Label>Iterations</Form.Label>
                  <Form.Control size="sm" onChange={updateIterations} defaultValue="3" min="1" type="number"></Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={12} md={4} lg={4}>
                <Form.Group controlId="extend1" className="mb-2">
                  <Form.Check size="sm" onChange={updateExtend} name="extendRadios" type="radio" label="Limitless" value="Limitless" checked={inputs.extend==="Limitless"}></Form.Check>
                </Form.Group>
                </Col>
                <Col sm={12} md={4} lg={4}>
                <Form.Group controlId="extend2" className="mb-2">
                  <Form.Check size="sm" onChange={updateExtend} name="extendRadios" type="radio" label="Stay On Root" value="Stay On Root" checked={inputs.extend==="Stay On Root"}></Form.Check>
                </Form.Group>
                </Col>
                <Col sm={12} md={4} lg={4}>
                <Form.Group controlId="extend3" className="mb-2">
                  <Form.Check size="sm" onChange={updateExtend} name="extendRadios" type="radio" label="Stay On Path" value="Stay On Path" checked={inputs.extend==="Stay On Path"}></Form.Check>
                </Form.Group>
                </Col>

              </Row>
              <Row className="mt-1">
              <Form.Group controlId="adjustpage" className="mb-2">
                <Form.Check size="sm" onChange={updateAdjustPage} type="switch" label="Link Files" checked={inputs.adjustPage}></Form.Check>
              </Form.Group>
              </Row>
              <Row className="mt-1">
              <Form.Group controlId="login" className="mb-2">
                <Form.Check size="sm" onChange={updateLogin} type="switch" label="Login" checked={inputs.login}></Form.Check>
              </Form.Group>
              </Row>
              <Row>
                <Col sm={12} md={6} lg={6}>
                <Form.Group controlId="username" className="mb-2">
                  <Form.Label>Username</Form.Label>
                  <Form.Control size="sm" onChange={updateUsername} placeholder="" type="text" disabled={!inputs.login}></Form.Control>
                </Form.Group>
                </Col>
                <Col sm={12} md={6} lg={6}>
                <Form.Group controlId="password" className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control size="sm" onChange={updatePassword} placeholder="" type="text" disabled={!inputs.login}></Form.Control>
                </Form.Group>
                </Col>
              </Row>
            </Form>
            <Row className="text-center">
              <Col>
                <Button className="mt-3 fs-5" type="submit" onClick={handleSubmit}>Download Webpage</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
  );
}

export default App;
