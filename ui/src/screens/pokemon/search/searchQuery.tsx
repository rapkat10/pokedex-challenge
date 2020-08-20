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

const POKEMON_MANY_BY_NAME = gql`
  query($name: String) {
    pokemonManyByName(name: $name) {
      name
      id
      img
      num
    }
  }
`

const MakeSearchQuery: React.FC<RouteComponentProps & { clickLink: Function, name: String }> = ({
  clickLink, name
}) => {
  const { loading, error, data } = useQuery(POKEMON_MANY_BY_NAME, {
    variables: { name },
  })
  const pokemonList: Array<{ name: string }> | undefined =
    data?.pokemonManyByName

  let pokemonResult:any
  if (pokemonList == undefined) {
    pokemonResult = []
  } else {
    pokemonResult = pokemonList
  }

  return (
    <ul id="search-link-list">
      My Unique Fuzzy Match Results
      {pokemonResult.map((pokemon:any) => (
        <Link to={pokemon.id} onMouseDown={clickLink as any}>
          <li>
            <img src={pokemon.img} />
            {pokemon.name} - {pokemon.num}
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default MakeSearchQuery
