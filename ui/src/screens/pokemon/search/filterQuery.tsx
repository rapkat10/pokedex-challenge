import React from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components'
import './search.css'

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`

const POKEMON_MANY = gql`
  query($skip: Int, $limit: Int, $types: [String], $weaknesses: [String]) {
    pokemonMany(skip: $skip, limit: $limit, types: $types, weaknesses: $weaknesses) {
      id
      name
      num
      img
    }
  }
`

const MakeFilterQuery: React.FC<RouteComponentProps & 
{ clickLink: Function, types: Array<String>, weaknesses: Array<String> }> = 
({ clickLink, types, weaknesses }) => {
  const { data } = useQuery(POKEMON_MANY, {
    variables: { types, weaknesses },
  })
  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  console.log("FROM FILTER QUERY: types: ", types)
  console.log("FROM FILTER QUERY: weaknesses: ", weaknesses)
  console.log("pokemon list", pokemonList)

  let pokemonResult: any
  if (pokemonList == undefined) {
    pokemonResult = []
  } else {
    pokemonResult = pokemonList
  }

  return (
    <ul id="filter-link-list">
      Filtered Pokemon
      {pokemonResult.map((pokemon: any) => (
        <Link to={pokemon.id} onMouseDown={clickLink as any}>
          <li className="filter-li">
            <img src={pokemon.img} />
            {pokemon.name} - {pokemon.num}
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default MakeFilterQuery
