import React from "react";
import PropTypes from "prop-types";

import { Col, Row } from "react-bootstrap";

const Paging = props => {
  const { pagesCount, pages, currentPage, onPageChange } = props;

  if (pagesCount === 1) return null;

  return (
    <Row className="justify-content-md-center">
      <Col md="auto">
        <nav>
          <ul className="pagination">
            {pages.map((page, i) => (
              <li key={i} className={page === currentPage ? "page-item active" : "page-item"}>
                <a className="page-link" onClick={() => onPageChange(page)}>
                  {page}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Col>
    </Row>
  );
};
Paging.propTypes = {
  pagesCount: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Paging;
