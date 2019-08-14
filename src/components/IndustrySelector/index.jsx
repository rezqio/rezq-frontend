import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import filter from 'lodash/filter';
import values from 'lodash/values';
import identity from 'lodash/identity';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { TAGS, TAGS_INVERTED } from '../../constants';

import './industryselector.css';

const TAGS_LIST = values(TAGS);

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = suggestion;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span>
      {
      parts.map((part, index) => {
        const className = part.highlight ? 'highlight' : null;
        // eslint-disable-next-line react/no-array-index-key
        return <span className={className} key={index}>{part.text}</span>;
      })
    }
    </span>
  );
}

class IndustrySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedList: [],
      value: '',
      suggestions: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  componentDidMount() {
    if (this.props.selected) {
      this.setState({
        selectedList: map(this.props.selected.split(','), tag => TAGS[tag]),
        value: this.props.singleInline ? TAGS[this.props.selected] : '',
      });
    }
  }

  onSuggestionSelected(_, { suggestion }) {
    this.setState(prevState => ({
      selectedList: (
        this.props.singleInline ? [suggestion] : [...prevState.selectedList, suggestion]
      ),
      value: this.props.singleInline ? prevState.value : '',
    }), () => {
      // TODO: FIXME - reopen the dropdown list
      this.input.blur();
      this.props.onChange(map(this.state.selectedList, tag => TAGS_INVERTED[tag]).join(','));
    });
  }

  onRemoveTag(removedTag) {
    this.setState(prevState => ({
      selectedList: filter(prevState.selectedList, tag => tag !== removedTag),
      value: '',
    }), () => {
      this.props.onChange(map(this.state.selectedList, tag => TAGS_INVERTED[tag]).join(','));
    });
  }

  onChange(_, { newValue }) {
    this.setState({
      value: newValue,
    });
    if (newValue === '' && this.props.singleInline) {
      this.props.onChange('');
    }
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    const selectedListSet = new Set(this.state.selectedList);

    if (escapedValue === '') {
      return filter(TAGS_LIST, tag => !selectedListSet.has(tag));
    }

    const regex = new RegExp(`\\b${escapedValue}`, 'i');

    return filter(
      TAGS_LIST,
      tag => regex.test(tag) && !selectedListSet.has(tag),
    );
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      placeholder: this.props.placeHolder,
    };

    return (
      <div>
        {!this.props.singleInline && (
        <div className="chips">
          {map(this.state.selectedList, tag => (
            <Chip
              key={tag}
              className="chip selected"
              color="primary"
              label={tag}
              onDelete={() => this.onRemoveTag(tag)}
            />
          ))}
        </div>
        )}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={identity}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          shouldRenderSuggestions={() => true}
          inputProps={inputProps}
          ref={(autosuggest) => {
            if (autosuggest !== null) {
              this.input = autosuggest.input;
            }
          }}
        />
      </div>
    );
  }
}

IndustrySelector.defaultProps = {
  selected: '',
  placeHolder: '+ Add an Industry',
  singleInline: false,
};

IndustrySelector.propTypes = {
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  singleInline: PropTypes.bool,
};

export default IndustrySelector;
