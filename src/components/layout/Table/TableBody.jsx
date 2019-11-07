import React, { Component } from "react";
import _ from "lodash";

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
  unToggle = () => {};
  click = (e, item) => {
    console.log("click", e);
    console.log("click", item);
  };
  render() {
    const { data, columns } = this.props;
    const { id, style } = this.state;
    return (
      <tbody>
        {data.map((item, i) => (
          <tr
            key={i}
            style={{ background: id === i ? style.trOptColor : "", cursor: style.cursor }}
            onClick={e => this.click(e, i)}
            onMouseEnter={e => this.toggle(e, i)}
            onMouseLeave={this.toggle}
          >
            {columns.map((column, j) => (
              <td key={i * 10 + j}>{this.renderCell(item, column)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
