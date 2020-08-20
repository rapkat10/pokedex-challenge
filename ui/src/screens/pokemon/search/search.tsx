import React, { useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import './search.css'
import MakeSearchQuery from './searchQuery'
import MakeFilterQuery from './filterQuery'
// 2 components for making the appropriate queries

const Search: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const [value, setValue] = useState('')
  const [searched, setSearched] = useState(false)
  const [filterSelected, setFilterSelected] = useState(false)

  const resetRadioButtons = () => {
    let radioInpts = document.querySelectorAll(".radio-input")
    radioInpts.forEach(input => {
      input['checked'] = false
    })
  }

  let searchResults
  let screen
  if (value != '') {
    searchResults = <MakeSearchQuery name={value} clickLink={clickLink} path="/" />
    if (!searched) {
      searchResults = ''
    }
    screen = <div className="screen" onClick={() => setSearched(false)}></div>
  } else {
    searchResults = ''
  }

  let filterResults
  if (filterSelected) {
    let filterTypes = {}
    let filterWeaknesses = {}
    let radioInputs = document.querySelectorAll(".radio-input")
    radioInputs.forEach((input, index) => {
      if (input['checked']) {
        if (index <= 2) {
          filterTypes[input['value']] = input
        } else {
          filterWeaknesses[input['value']] = input
        }
      }
    })

    filterResults = <MakeFilterQuery types={Object.keys(filterTypes)} weaknesses={Object.keys(filterWeaknesses)} clickLink={clickLink} path="/" />
    console.log("types", Object.keys(filterTypes))
    console.log("types", Object.keys(filterWeaknesses))
  } else {
    filterResults = ''
  }
  return (
    <div>
      <div className="search-bar-main">
        <input
          type="text"
          className="search-input"
          placeholder="Search Pokemon"
          onChange={event => setValue(event.target.value)}
          onClick={() => setSearched(true)}
        />
        {searchResults}
      </div>
      {screen}
      <div className="radio-btns-div">
        <div>Filters</div>
          <div className="types">
            Types
            <br />
            <label className="radio-labels">
              Flying
              <br />
              <input className="radio-input" type="radio" value="Flying" />
            </label>
            <label className="radio-labels">
              Fire
              <br />
              <input className="radio-input" type="radio" value="Fire" />
            </label>
            <label className="radio-labels">
              Water
              <br />
              <input className="radio-input" type="radio" value="Water" />
            </label>
          </div>

          <div className="weaknesses">
            Weaknesses
            <br />
            <label className="radio-labels">
              Flying
              <br />
              <input className="radio-input" type="radio" value="Flying" />
            </label>
            <label className="radio-labels">
              Fire
              <br />
              <input className="radio-input" type="radio" value="Fire" />
            </label>
            <label className="radio-labels">
              Water
              <br />
              <input className="radio-input" type="radio" value="Water" />
            </label>
          </div>
        <button className="filter-submit" type="submit" onClick={() => setFilterSelected(true)}>
          Apply Filters
        </button>
        <button className="filter-reset" onClick={() => resetRadioButtons()}>Reset Filters</button>
      </div>
      <div className="filter-results-div">
        {filterResults}
      </div>
    </div>
  )
}

export default Search
