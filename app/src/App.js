import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap'
import downloadWebpage from './logic.js'

function App() {
  const [inputs, setInputs] = useState({name: "file", link: "https://example.com", iterations: 3, login: false});

  const updateName = (e) => {
    setInputs(inputs => ({ ...inputs, name: e.target.value }));
  }
  const updateLink = (e) => {
    setInputs(inputs => ({ ...inputs, link: e.target.value }));
  }
  const updateIterations = (e) => {
    setInputs(inputs => ({ ...inputs, iterations: e.target.value }));
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
    //console.log(inputs)
    downloadWebpage(inputs.name, inputs.link)
  }
  return (
      <Container>
        <Row className="mt-3 justify-content-center">
          <Col sm={12} md={10} lg={10}>
            <Alert variant="primary" className="text-center fs-2">WebDownload</Alert>
          </Col>
        </Row>
        <Row className="justify-content-center text-start fs-5">
          <Col sm={12} md={10} lg={10}>
            <Form>
            <Row>
                <Col sm={12}>
                <Form.Group controlId="link" className="mb-2">
                  <Form.Label>Website Link</Form.Label>
                  <Form.Control size="sm" onChange={updateLink} placeholder="example.com" type="text"></Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={9} lg={9}>
                <Form.Group controlId="name" className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control size="sm" onChange={updateName} placeholder="Example" type="text"></Form.Control>
                </Form.Group>
                </Col>
                <Col sm={12} md={3} lg={3}>
                <Form.Group controlId="iterations" className="mb-2">
                  <Form.Label>Iterations</Form.Label>
                  <Form.Control size="sm" onChange={updateIterations} defaultValue="10" min="0" type="number"></Form.Control>
                </Form.Group>
                </Col>
              </Row>
              {/* <Form.Group controlId="name" className="mb-2">
                <Form.Label >Name</Form.Label>
                <Form.Control size="sm" onChange={updateName} placeholder="Name" type="text"></Form.Control>
              </Form.Group>
              <Form.Group controlId="link" className="mb-2">
                <Form.Label>Website Link</Form.Label>
                <Form.Control size="sm" onChange={updateLink} placeholder="example.com" type="text"></Form.Control>
              </Form.Group>
              <Form.Group controlId="iterations" className="mb-2">
                <Form.Label>Iterations</Form.Label>
                <Form.Control size="sm" onChange={updateIterations} placeholder="10" min="0" type="number"></Form.Control>
              </Form.Group> */}
              <Form.Group controlId="login" className="mt-3 mb-2">
                <Form.Check size="sm" onChange={updateLogin} type="switch" label="Login"></Form.Check>
              </Form.Group>
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
              {/* <Form.Group controlId="username" className="mb-2">
                <Form.Label>Username</Form.Label>
                <Form.Control size="sm" onChange={updateUsername} placeholder="" type="text" disabled={!inputs.login}></Form.Control>
              </Form.Group>
              <Form.Group controlId="password" className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control size="sm" onChange={updatePassword} placeholder="" type="text" disabled={!inputs.login}></Form.Control>
              </Form.Group> */}
            </Form>
            <Row className="text-center fs-2"><Col><Button className="mt-2" type="submit" onClick={handleSubmit}>Download Webpage</Button></Col></Row>
          </Col>
        </Row>
      </Container>
  );
}

export default App;
