import React, { Component } from "react";

import sort from "../../utils/Sort";
import InputForm from "../Form/InputForm";
import EditForm from "../Form/EditForm";

import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableNav from "./TableNav";
import { paginate } from "../../utils/Paginate";

import SideBarFilters from "./sidebar/SideBarFilters";
import SideBarOptions from "./sidebar/SideBarOptions";

import _ from "lodash";
import TableData from "../../utils/Data/TableData";

class Table extends Component {
  //table arguments from parent
  //const { headers, data, dataName, dataLoad } = this.props;

  state = {
    //data
    data: [],
    dataName: "",
    headers: [],
    ids: [],
    columnKeys: [],
    uniqueData: [],
    //table header
    sortedColumn: { path: "", order: "" }, //table sorted by which column
    //paginating
    pageSize: 5, //set the page size
    currentPage: 1, //set the current page, default 1
    //filters
    sideBarFiltersOpen: false, //is open
    tableFilters: {},
    //options
    sideBarOptionsOpen: false,
    columnSelect: {},
    //add item
    editFormOpen: false,
    editFormData: {}
  };

  componentDidMount() {
    this.getDataSet();

    console.log("Table-MOUNTED");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Table-UPDATED");
    const { tableFilters, columnSelect } = this.state;
    const { tableFilters: prevFilters, columnSelect: prevSelect } = prevState;
    const { data: prevPropsData } = prevProps;
    if (this.props.data !== prevPropsData) {
      this.getDataSet();
    }

    if (prevFilters !== tableFilters || prevSelect !== columnSelect) {
      this.handleFilters();
    }
  }
  //set data
  getDataSet = () => {
    const { data, dataName } = this.props;
    // get data and update state

    const dataSet = new TableData(data);
    const tableData = dataSet.getTableData();
    const uniqueData = dataSet.getUniqueData();
    const filterKeys = dataSet.getFilterKeys();
    const columnFilters = dataSet.getColumns();

    this.setState({
      data: tableData.data,
      dataName,
      headers: tableData.headers,
      ids: tableData.ids,
      columnKeys: tableData.keys,
      uniqueData,
      sortedColumn: { path: tableData.keys[0], order: "asc" },
      tableFilters: filterKeys,
      columnSelect: columnFilters
    });
  };

  handleSort = sortedColumn => {
    this.setState({ sortedColumn });
  };

  handlePageChange = page => {
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
    e.preventDefault();
    const data = this.props.data;

    const input = e.target.value;
    const result = data.filter(item => {
      const includes = [];
      Object.values(item.data).map(value => {
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
    this.setState({ data: result });
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
        if (tfValue !== "") match.push(item.data[tfEntry] === tfValue);
      }
      return match.every(m => m === true);
    });
    console.log(filters);
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
    const { data } = this.props;
    const { tableFilters, columnSelect } = this.state;
    //an array of id numbers
    const filteredData = new TableData(data, tableFilters, columnSelect);
    const tableData = filteredData.getTableData();
    const uniqueData = filteredData.getUniqueData();
    this.setState({
      data: tableData.data,
      headers: tableData.headers,
      columnKeys: tableData.keys,
      uniqueData,
      sortedColumn: { path: tableData.keys[0], order: "asc" }
    });
  };

  resetTable = () => {
    const { data } = this.props;
    //an array of id numbers

    const tableData = data.getTableData();
    const uniqueData = data.getUniqueData();
    const filterKeys = data.getFilterKeys();
    const columnFilters = data.getColumns();

    this.setState({
      data: tableData.data,
      headers: tableData.headers,
      columnKeys: tableData.keys,
      uniqueData,
      sortedColumn: { path: tableData.headers[0], order: "asc" },
      tableFilters: filterKeys,
      columnSelect: columnFilters
    });
  };
  handleEditClose = () => {
    this.setState({ editFormOpen: false, editFormData: {} });
  };

  handleEdit = data => {
    const dataSet = this.props.data;
    this.setState({ editFormOpen: true });

    dataSet.map(item => {
      if (item.id === data) {
        this.setState({ editFormData: { data: item.data, id: item.id } });
      }
    });
  };

  render() {
    const {
      data,
      dataName,
      headers,
      ids,
      columnKeys,
      uniqueData,
      sortedColumn,
      pageSize,
      currentPage,
      sideBarFiltersOpen,
      tableFilters,
      sideBarOptionsOpen,
      columnSelect,
      editFormOpen,
      editFormData
    } = this.state;
    const { schema, handleSave, handleDelete, handleEditItem } = this.props;
    const count = data.length;
    //filter first
    const sorted = sort(data, sortedColumn.path, sortedColumn.order);
    const dataPage = paginate(sorted, currentPage, pageSize);

    return (
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
          <TableBody
            columns={columnKeys}
            data={dataPage}
            ids={ids}
            handleDelete={handleDelete}
            handleEdit={this.handleEdit}
          />
        </table>
        <InputForm
          keys={columnKeys}
          headers={headers}
          dataName={dataName}
          schema={schema}
          saveData={handleSave}
        />
        <EditForm
          dataName={dataName}
          schema={schema}
          open={editFormOpen}
          data={editFormData}
          handleEditClose={this.handleEditClose}
          handleEditItem={handleEditItem}
        />
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
