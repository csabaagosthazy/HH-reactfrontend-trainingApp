import React from "react";
import PropTypes from "prop-types";

import { Col, Row, Form } from "react-bootstrap";

const PageSizing = props => {
  const { selectOptions, onPageSizeChange } = props;
  return (
    <Row className="justify-content-md-center">
      <Col md="auto">
        <Form.Group as={Row} md="3">
          <Form.Label column sm={3}>
            Rows
          </Form.Label>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <Form.Control as="select" onChange={onPageSizeChange}>
              {selectOptions.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>
      </Col>
    </Row>
  );
};

PageSizing.propTypes = {
  selectOptions: PropTypes.array.isRequired,
  onPageSizeChange: PropTypes.func.isRequired
};

export default PageSizing;
