import React, { Component } from "react";

import { getDataSet, deleteData, getDataKeys, doTest } from "../../utils/Database.utils";
import TableData from "../../utils/Data/TableData";

import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableNav from "./TableNav";
import { paginate } from "../../utils/Paginate";

import SideBarFilters from "./sidebar/SideBarFilters";
import SideBarOptions from "./sidebar/SideBarOptions";

import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

class Table extends Component {
  //table arguments from parent
  //const { headers, data, dataName, dataLoad } = this.props;

  state = {
    //data
    data: [],
    dataName: "",
    headers: [],
    columnKeys: [],
    uniqueData: [],
    isLoading: true,
    //table header
    sortedColumn: { path: "", order: "" }, //table sorted by which column
    tableData: [],
    //paginating
    pageSize: 5, //set the page size
    currentPage: 1, //set the current page, default 1
    //filters
    sideBarFiltersOpen: false, //is open
    tableFilters: {},
    //options
    sideBarOptionsOpen: false,
    columnSelect: {}
  };

  componentDidMount() {
    const { link, sublink, dataName, selectedColumns } = this.props;

    // fetch data and update state
    getDataSet(link, sublink).then(res => {
      const data = new TableData(res.data, selectedColumns);
      const tableData = data.getTableData();
      const uniqueData = data.getUniqueData();
      const filterKeys = data.getFilterKeys();
      const columnFilters = data.getColumns();

      this.setState({
        data: tableData.data,
        dataName,
        headers: tableData.headers,
        columnKeys: tableData.keys,
        uniqueData,
        isLoading: res.isLoading,
        sortedColumn: { path: tableData.headers[0], order: "asc" },
        tableData: tableData.data,
        tableFilters: filterKeys,
        columnSelect: columnFilters
      });
    });

    console.log("Table - Mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Table_UPDATED");
    const { tableFilters, columnSelect } = this.state;
    const { tableFilters: prevFilters, columnSelect: prevSelect } = prevState;

    if (prevFilters !== tableFilters || prevSelect !== columnSelect) {
      console.log("Filters updated");
      this.handleFilters();
    }
  }

  handleSort = sortedColumn => {
    this.setState({ sortedColumn });
  };

  handlePageChange = page => {
    console.log(page);
    this.setState({ currentPage: page });
  };

  pageSizeChange = e => {
    this.setState({ pageSize: Number(e.target.value) });
  };

  toggleDrawer = (open, path) => event => {
    //handle sidebar open/close
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    // based on which button pressed on tableNav
    if (path === "filters") {
      this.setState({ sideBarFiltersOpen: open });
    } else {
      this.setState({ sideBarOptionsOpen: open });
    }
  };
  handleSearch = e => {
    const data = this.state.data;

    const input = e.target.value;
    const result = data.filter(item => {
      const includes = [];
      Object.values(item).map(value => {
        {
          includes.push(
            String(value)
              .toLocaleLowerCase()
              .includes(input.toLocaleLowerCase())
          );
        }
      });
      return includes.find(i => i === true);
    });
    this.setState({ tableData: result });
  };

  handleFilterChange = event => {
    //reset the data based on the given object
    //set state (count, data)
    console.log("handle filter");
    const { data, tableFilters } = this.state;
    const { name, value } = event.target;
    const filters = { ...tableFilters, [name]: value };

    const result = data.filter(item => {
      const match = [];
      for (const [tfEntry, tfValue] of Object.entries(filters)) {
        if (tfValue !== "") match.push(item[tfEntry] === tfValue);
      }
      return match.every(m => m === true);
    });

    this.setState({
      tableFilters: filters
    });
  };

  handleOptionsChange = path => event => {
    const { columnSelect } = this.state;
    const options = { ...columnSelect, [path]: event.target.checked };
    this.setState({ columnSelect: options });
    console.log(columnSelect);
  };

  handleFilters = () => {
    const { selectedColumns } = this.props;
    const { data, tableFilters, columnSelect } = this.state;
    //an array of id numbers

    const filterData = new TableData(data, selectedColumns);
    const result = filterData.getFilteredData(tableFilters, columnSelect);

    const newData = new TableData(result, selectedColumns);

    const tableData = newData.getTableData();
    const uniqueData = newData.getUniqueData();

    this.setState({
      headers: tableData.headers,
      columnKeys: tableData.keys,
      uniqueData,
      sortedColumn: { path: tableData.headers[0], order: "asc" },
      tableData: tableData.data
    });
  };

  resetTable = () => {
    const { selectedColumns } = this.props;
    const { data } = this.state;
    //an array of id numbers

    const resetData = new TableData(data, selectedColumns);
    const tableData = resetData.getTableData();
    const uniqueData = resetData.getUniqueData();
    const filterKeys = resetData.getFilterKeys();
    const columnFilters = resetData.getColumns();

    this.setState({
      tableData: tableData.data,
      headers: tableData.headers,
      columnKeys: tableData.keys,
      uniqueData,
      sortedColumn: { path: tableData.headers[0], order: "asc" },
      tableFilters: filterKeys,
      columnSelect: columnFilters
    });
  };

  render() {
    const {
      data,
      dataName,
      headers,
      columnKeys,
      uniqueData,
      isLoading,
      sortedColumn,
      tableData,
      pageSize,
      currentPage,
      sideBarFiltersOpen,
      tableFilters,
      sideBarOptionsOpen,
      columnSelect
    } = this.state;

    const count = tableData.length;
    //filter first

    const sorted = _.orderBy(tableData, [sortedColumn.path], [sortedColumn.order]);
    const dataPage = paginate(sorted, currentPage, pageSize);

    if (isLoading)
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <CircularProgress />
        </div>
      );
    if (data.length === 0) return <p>There are no {dataName} in the database} </p>;
    return (
      //<p>Done</p>
      <div>
        <TableNav
          resetTable={this.resetTable}
          toggleDrawer={this.toggleDrawer}
          onSearch={this.handleSearch}
        />
        <SideBarFilters
          open={sideBarFiltersOpen}
          headers={headers}
          keys={columnKeys}
          data={uniqueData}
          filters={tableFilters}
          toggleDrawer={this.toggleDrawer}
          handleFilter={this.handleFilterChange}
        />
        <SideBarOptions
          open={sideBarOptionsOpen}
          headers={headers}
          keys={columnKeys}
          columnSelect={columnSelect}
          toggleDrawer={this.toggleDrawer}
          handleChange={this.handleOptionsChange}
        />
        <table className="table">
          <TableHeader
            headers={headers}
            keys={columnKeys}
            sortedColumn={sortedColumn}
            onSort={this.handleSort}
          />
          <TableBody columns={columnKeys} data={dataPage} />
        </table>
        <Pagination
          itemsCount={count}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
          onPageSizeChange={this.pageSizeChange}
        />
      </div>
    );
  }
}

export default Table;
