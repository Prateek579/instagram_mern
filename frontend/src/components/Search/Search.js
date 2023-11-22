import React, { useState } from "react";
import "./search.css";
const Search = () => {
  const [profileDetails, setProfileDetails] = useState([]);
  const [searchName, setSearchName] = useState("");

  const handleSearchProfile = async (e) => {
    e.preventDefault();
    const request = await fetch(
      `http://localhost:8022/api/user/profile/${searchName}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const response = await request.json();
    if (response.success === true) {
      setProfileDetails(response.userProfile);
    }
  };

  return (
    <div className="search_container">
      <div className="search_bar">
        <div className="search_text">Search</div>
        <div className="search_input">
          <form className="form" onSubmit={handleSearchProfile}>
            <input
              type="text"
              placeholder="Search"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </form>
          <i
            class="fa-regular fa-circle-xmark"
            onClick={() => setSearchName("")}
          ></i>
        </div>
      </div>
      <div className="search_results">
        {profileDetails.length === 0
          ? ""
          : profileDetails.map((item) => {
              return (
                <div className="search_card" key={item.photo + 13}>
                  <div className="search_user_image">
                    <img
                      src={`http://localhost:8022/` + item.photo}
                      alt="search user image"
                    />
                    <div className="search_user_details">
                      <p>{item.name}</p>
                    </div>
                  </div>
                  <div className="search_user_followers">
                    <p>Followers</p> {item.followers.length}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Search;
