import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import './SearchBar.css';

export default function SearchBar({ user_data }) {
  const searchedUser = useRef();
  const node = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [])

  const handleClick = (e) => {
      if (node.current.contains(e.target)) {
        return;
      }
      setShowResult(false)
  }

  const searchForUser = () => {
    let searchedValue = searchedUser.current.value;
    if(searchedValue !== '') {
      fetchUsers(searchedUser.current.value)
    } else {
      setShowResult(false)
      setSearchResults([])
    }
  }

  async function fetchUsers(value) {
    return await axios.post(process.env.REACT_APP_API_URL+'/users/search/', {username: value, current_id: user_data._id}).then(res => {
      setSearchResults(res.data.users);
      setShowResult(true);
    })
  }

  return (
    <div className="search-container" ref={node}>
      <input type="text" ref={searchedUser} onChange={searchForUser} placeholder="Search user" />
      <div className={`result-panel ${showResult ? "show-result" : ""}`}>
        {showResult ? (
          searchResults.length > 0 ? ( searchResults.map((result, index) => (
            <p key={index}><a href={'/profil/'+result._id}>{result.username}</a></p>
          ))
        ) : <p>No user found</p> ) : ''}
      </div>
    </div>
  )
}