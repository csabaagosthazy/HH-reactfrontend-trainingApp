import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { rowsToShow } from "../../utils/Paginate";

import { Container } from "react-bootstrap";
import Paging from "./pagination/Paging";
import PageSizing from "./pagination/PageSize";

const Pagination = props => {
  //page number array via props
  const { itemsCount, pageSize, currentPage, onPageChange, onPageSizeChange } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize);

  const pages = _.range(1, pagesCount + 1);

  const selectOptions = rowsToShow(itemsCount);

  return (
    <Container>
      <Paging
        pagesCount={pagesCount}
        pages={pages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      <PageSizing selectOptions={selectOptions} onPageSizeChange={onPageSizeChange} />
    </Container>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired
};

export default Pagination;
