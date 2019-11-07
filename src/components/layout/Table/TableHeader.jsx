import React, { Component } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

//from props get
// columns (array)
// sortedColums (Obj)
// onSort (function)

class TableHeader extends Component {
  raiseSort = path => {
    const sortedColumn = { ...this.props.sortedColumn };
    if (sortedColumn.path === path)
      sortedColumn.order = sortedColumn.order === "asc" ? "desc" : "asc";
    else {
      sortedColumn.path = path;
      sortedColumn.order = "asc";
    }
    this.props.onSort(sortedColumn);
    console.log("sorted column: " + sortedColumn.path, sortedColumn.order);
  };

  renderSortIcon(column) {
    const { path, order } = this.props.sortedColumn;
    if (column !== path) return null;

    if (order === "asc") return <ArrowDropDownIcon />;

    return <ArrowDropUpIcon />;
  }

  render() {
    const { headers, keys } = this.props;
    return (
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th style={{ cursor: "pointer" }} key={i} onClick={() => this.raiseSort(keys[i])}>
              {header}
              {this.renderSortIcon(keys[i])}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
