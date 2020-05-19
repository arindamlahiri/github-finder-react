import React, { useReducer } from 'react'
import axios from 'axios'
import GithubContext from './githubContext'
import GithubReducer from './githubReducer'
import {
    SEARCH_USERS,
    SET_LOADING,
    CLEAR_USERS,
    GET_USER,
    GET_REPOS
} from '../types'

let githubClientId;
let githubClientSecret;

if(process.env.NODE_ENV !== 'production'){
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID
} else {
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET
  githubClientId = process.env.GITHUB_CLIENT_ID
}

const GithubState = props => {
    const initialState ={
        users:[],
        user:{},
        repos:[],
        loading:false
    }

    const [state, dispatch] = useReducer(GithubReducer, initialState)

    // Search Users
    const searchUsers = async(text) => {
        // setLoading(true)
        setLoading()
        const res = await axios.get(`https://api.github.com/search/users?q=${text}`, {
          auth: {
            username:githubClientId,
            password:githubClientSecret
          }
        })
        // setUsers(res.data.items)
        // setLoading(false)
        dispatch({
            type: SEARCH_USERS,
            payload: res.data.items
        })
    }

    // Get User
    const getUser = async (username) => {
        setLoading()
        const res = await axios.get(`https://api.github.com/users/${username}`, {
          auth: {
            username:githubClientId,
            password:githubClientSecret
          }
        })
        dispatch({
            type: GET_USER,
            payload: res.data
        })
    }

    // Get Repos
    const getUserRepos = async (username) => {
        setLoading()
        const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`, {
          auth: {
            username:githubClientId,
            password:githubClientSecret
          }
        })
        // setRepos(res.data)
        dispatch({
            type: GET_REPOS,
            payload:res.data
        })
    }

    // Clear Users
    const clearUsers = () => {
        // setLoading(false)
        // setUsers([])
        dispatch({ type: CLEAR_USERS })
      }    

    // Set Loading
    const setLoading = () => dispatch({ type: SET_LOADING })


    return <GithubContext.Provider 
    value={{
        users:state.users,
        user:state.user,
        repos:state.repos,
        loading:state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
    }}
    >
        {props.children}
    </GithubContext.Provider>
}

export default GithubState