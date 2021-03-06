import React, { Component } from "react";
import AutoComplete from "material-ui/AutoComplete";
import theme from "../../../theme";
import PropTypes from "prop-types";

class AutoCompleteWithFilters extends Component {
  static propTypes = {
    items: PropTypes.array,
    onUpdateInput: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    userAddress: PropTypes.string
  };
  render() {
    const { items, label, onUpdateInput, error, errorText } = this.props;
    let arr = [];
    for (let i = 0; i < items.length; i++) arr.push(items[i].description);
    return (
      <AutoComplete
        floatingLabelText={label}
        filter={AutoComplete.fuzzyFilter}
        dataSource={arr}
        maxSearchResults={5}
        onUpdateInput={onUpdateInput}
        fullWidth
        errorText={error ? errorText : ""}
        style={{
          color: error ? theme.darkRed : theme.blue
        }}
      />
    );
  }
}

export default AutoCompleteWithFilters;
