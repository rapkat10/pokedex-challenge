import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'
import Search from './search/search'
// New seach component created
const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

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
  query($skip: Int, $limit: Int) {
    pokemonMany(skip: $skip, limit: $limit) {
      id
      name
      num
      img
    }
  }
`

const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const { loading, error, data } = useQuery(POKEMON_MANY)
  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList) {
    return <p>Error!</p>
  }
// I am just rendering the search component below, it also has the filtering form.
  return (
    <Container rounded>
      <Search clickLink={clickLink} path="/" /> 
      <List>
        Default Pokemon
        {pokemonList.map(pokemon => (
          <Link to={pokemon.id} onMouseDown={clickLink as any}>
            <ListItem>
              <img src={pokemon.img} />
              {pokemon.name} - {pokemon.num}
            </ListItem>
          </Link>
        ))}
      </List>
    </Container>
  )
}

export default Pokemon
