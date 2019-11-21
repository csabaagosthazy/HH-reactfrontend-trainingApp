import React, { Component } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

//gets
//data
//columns

class TableBody extends Component {
  state = {
    id: "",
    style: {
      trOptColor: "lightGrey",
      cursor: "pointer"
    }
  };
  renderCell = (item, column) => {
    //console.log("item", item, "column", column);
    if (column.content) return column.content(item);

    return _.get(item, column);
  };

  toggle = (e, i) => {
    if (i >= 0) {
      this.setState({
        id: i
      });
    } else {
      this.setState({
        id: ""
      });
    }
  };

  click = (e, item) => {
    e.preventDefault();
    console.log("click", e.currentTarget.id);
    console.log(e.currentTarget);
  };
  render() {
    const { data, columns, handleDelete, handleEdit } = this.props;
    const { id, style, hiddenTd } = this.state;

    return (
      <tbody>
        {data.map((item, i) => (
          <tr
            id={item.id}
            key={i}
            style={{ background: id === i ? style.trOptColor : "" }}
            onMouseEnter={e => this.toggle(e, i)}
            onMouseLeave={this.toggle}
          >
            {columns.map((column, j) => (
              <td key={i * 10 + j}>{this.renderCell(item.data, column)}</td>
            ))}
            <td style={{ display: id === i ? "none" : "", width: "100px" }}></td>
            <td style={{ display: id === i ? "" : "none", width: "10px" }}>
              <Grid container>
                <Grid item xs={10}>
                  <DeleteIcon
                    id={item.id}
                    name={"delete"}
                    color="secondary"
                    style={{ cursor: style.cursor, margin: "1" }}
                    onClick={e => handleDelete(e.currentTarget.id)}
                  />
                  <EditIcon
                    id={item.id}
                    name={"edit"}
                    color="primary"
                    style={{ cursor: style.cursor, margin: "1" }}
                    onClick={e => handleEdit(Number(e.currentTarget.id))}
                  />
                </Grid>
              </Grid>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
