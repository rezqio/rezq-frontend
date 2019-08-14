import React from 'react';
import './resources.css';
import {
  Button, Grid, Row, Col,
} from 'react-bootstrap';
import techResume from '../../assets/resumes/dongyu-zheng.pdf';
import researchResume from '../../assets/resumes/austin-tripp.pdf';
import accountingResume from '../../assets/resumes/accounting.pdf';

const Examples = () => (
  <div className="resources-container">
    <Grid className="resources-grid">
      <Row className="justify-content-md-center">
        <Col sm={12} md={6}>
          <h3 className="resources-header">
            Need inspiration?
            {' '}
            <br />
            These are real resumes by UWaterloo students.
          </h3>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm={6} md={3}>
          <Button className="resources-button" target="_blank" src={techResume} href={techResume}>
            Tech
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm={6} md={3}>
          <Button className="resources-button" target="_blank" src={researchResume} href={researchResume}>
            Research
          </Button>
        </Col>
        <Col sm={6} md={3}>
          <Button className="resources-button" target="_blank" src={accountingResume} href={accountingResume}>
            Accounting
          </Button>
        </Col>
      </Row>
    </Grid>
  </div>
);

export default Examples;
