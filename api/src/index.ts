import { ApolloServer, gql, IResolvers } from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import filter from 'lodash/filter'
import pokemon from './pokemon.json'

// Imported filter from lodash/filter to use on the filtering out feature!

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonMany(skip: Int, limit: Int, types: [String], weaknesses: [String]): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
    pokemonManyByName(name: String): [Pokemon!]!
  }
`
// ^ Updated the fields and Added new query for the Search Feature!

// All Below functions untill the resolvers are for my fuzzy matching logic.
const filterResult = (arr:any, str:string) => {
  let filteredResult: string[] = []
  let num = str.length
  
  arr.forEach((substr:string) => {
    if (num > 3) {
      if(substr.length >= 3){
        filteredResult.push(substr)
      }
    } else {
      filteredResult.push(substr)
    }
  })
  
  return filteredResult
}

const getAllSubstrings = (str:string) => {
  let i
  let j
  let result = []

  for (i = 0; i < str.length; i++) {
    for (j = i + 1; j < str.length + 1; j++) {
      result.push(str.slice(i, j))
    }
  }
  
  return filterResult(result, str)
}

const isMatch = (str1:string, str2:string) => {
  let substrs = getAllSubstrings(str1)
  let matched = false
  substrs.forEach((substr:string) => {
    if (str2.includes(substr)) {
      matched = true
    }
  })
  return matched
}

const dynamicSort = (property:string, str:string) => {

  return function (a:any, b:any) {
    let result
    if (a[property][0].toLowerCase() == str && b[property][0].toLowerCase() == str) {
      result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
    } else {
      if (a[property][0].toLowerCase() == str) {
        result = -1
      } else if (b[property][0].toLowerCase() == str) {
        result = 1
      } else {
        result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
      }
    }
    return result
  }
}

// These 2 functions are helper functions for filtering out pokemon!
const typesfilter = (types: any, pokemon: any) => {
  return types.every((filter: string) =>
    pokemon.types.includes(filter)
  )
}

const weaknessesfilter = (weaknesses: any, pokemon: any) => {
  return weaknesses.every((filter: string) =>
    pokemon.weaknesses.includes(filter)
  )
} 

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: { // Updated this query for the filtering feature
    pokemonMany(_, {skip = 0, limit = 999, types, weaknesses,}: {
      skip?: number; limit?: number; types: []; weaknesses: [] }
    ): Pokemon[] | undefined {
      if ((types === undefined || types.length < 1) && (weaknesses === undefined || weaknesses.length < 1)) {
        return sortBy(pokemon, poke => parseInt(poke.id, 10)).slice(
          skip, limit + skip
        )
      } else if (types.length > 0 && weaknesses.length > 0) {
        return filter(pokemon,currentPokemon =>
          typesfilter(types, currentPokemon) &&
          weaknessesfilter(weaknesses, currentPokemon)
        )
      }else if (types.length > 0) {
        return filter(pokemon, currentPokemon =>
          typesfilter(types, currentPokemon)
        )
      }else if (weaknesses.length > 0) {
        return filter(pokemon, currentPokemon =>
          weaknessesfilter(weaknesses, currentPokemon)
        )
      }
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    }, // below query is for the Search feature!
    pokemonManyByName(_, { name }: { name: string }): Pokemon[] {
      let resultArray: any[] = []
      let pokemonArray = Object.values(pokemon)
      pokemonArray.forEach((pokemon: any) => {
        if (isMatch(name.toLowerCase(), pokemon.name.toLowerCase())) {
          resultArray.push(pokemon)
        }
      })
      return resultArray.sort(dynamicSort('name', name[0].toLowerCase()))
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
