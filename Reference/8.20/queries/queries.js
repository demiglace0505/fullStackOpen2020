import { gql } from '@apollo/client'

export const WHOAMI = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      author{
        name
        born
        bookCount
      }
    }
  }
`

export const ALL_BOOKS_WITH_GENRE = gql`
  query allBooksWithGenre(
    $genreToSearch: String!
  ) {
    allBooks(
      genre: $genreToSearch
    ){
      title
      published
      author{
        name
        born
        bookCount
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!,
    $author: String!,
    $published: Int!,
    $genres: [String!]
    ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`

export const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`