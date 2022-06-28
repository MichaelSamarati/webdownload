import React, {useState, useEffect, useMemo} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import downloadWebpage from './logic.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Chart from './Chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [isDownload, setDownload] = useState(false);
  const [inputs, setInputs] = useState({name: "Example", link: "https://example.com", iterations: 2, extend: "Limitless", adjustPage: true, login: false});
  const [status, setStatus] = useState([]);
  const [chart, setChart] = useState(
    {
      labels: [],
  datasets: [{
    label: "Downloaded Files At Iteration",
    data: [],
    backgroundColor: "#0275d8" 
  }]
});
  function generateChartData(iterations){
    setStatus(prev => {
      let data = [];
      for (let i = 0; i < iterations; i++) {
        let obj = {
          iteration: i+1,
          count: 2
        }
        data.push(obj);
      }
      console.log(data)
      return data;
    })
  }
  function updateChart(){
    setChart(prev => {
      console.log("status")
      console.log(status)
      let chartData = {
      labels: status?.map(level => {return level.iteration;}),
      datasets: [{
        label: "Downloaded Files At Iteration",
        data: status?.map(level => {return level.count;}),
        backgroundColor: "#0275d8" 
      }]
      }
      console.log(chartData)
      return chartData
    });
  }

  useEffect(() => {
    generateChartData(inputs.iterations)
  }, [inputs.iterations])
  useEffect(() => {
    updateChart()
  }, [status])
  const updateName = (e) => {
    setInputs(inputs => ({ ...inputs, name: e.target.value }));
  }
  const updateLink = (e) => {
    setInputs(inputs => ({ ...inputs, link: e.target.value }));
  }
  const updateIterations = (e) => {
    const iterations = e.target.value;
    setInputs(inputs => ({ ...inputs, iterations: iterations }));
    // var labels = [];
    // var data = [];
    // for (let i = 1; i <= iterations; i++) {
    //   labels.push(i);
    //   data.push(0);
    // }
    // setStatus(prev => {
    //   let datacopy = Object.assign({}, prev)
    //   // //var obj = { ...prev };
    //   // console.log(datacopy);
    //   // datacopy.labels = labels;
    //   // //console.log(datacopy.datasets[0])

    //   // datacopy.datasets[0].data = data;
    //   // //console.log(obj.datasets[0])
    //   // console.log(datacopy);
    //   // return datacopy
    //   let dataset = datacopy.datasets[0];
    //   dataset = {...dataset, data: data}
    //   //return {labels: labels, datasets: [{label: "2wadawd", data: data}]}
    //   return {labels: labels, datasets: [...datacopy.datasets, dataset]}
    // })
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
  const cancelDownload = (e) => {
    setDownload(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setDownload(true)
    console.log(inputs)
    downloadWebpage(status, setStatus, inputs.name, inputs.link, inputs.iterations, inputs.extend, inputs.adjustPage)
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
              <Row className="mt-2">
              <Form.Group controlId="adjustpage" className="mb-2">
                <Form.Check size="sm" onChange={updateAdjustPage} type="switch" label="Link Files" checked={inputs.adjustPage}></Form.Check>
              </Form.Group>
              </Row>
              <Row className="mt-2">
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
            <Row className="mt-3 text-center">
              <Col>
                <Button className="fs-5" type="submit" onClick={handleSubmit}>Download Webpage</Button>
              </Col>
              <Col>
                <Button className="fs-5" variant="secondary" disabled={!isDownload} onClick={cancelDownload}>Cancel</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-4 mb-5">
          <Col>
            <Chart id="chart" chartData={chart}></Chart>
          </Col>
        </Row>
      </Container>
  );
}

export default App;
