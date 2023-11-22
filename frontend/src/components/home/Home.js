import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import storeContext from "../../context/store";
const Home = () => {
  const context = useContext(storeContext);
  const { userToken, setAlertMessage, loginUserID } = context;

  const [profileDetails, setProfileDetails] = useState([]);

  // making fetch request to the server for fetching all the users profiles
  const allProfiles = async () => {
    try {
      const request = await fetch("http://localhost:8022/api/user/allprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      const filterFrofiles = response.profiles.filter(
        (element) => element._id !== loginUserID
      );
      setProfileDetails(filterFrofiles);
    } catch (error) {
      console.log("all profile frontend error", error);
    }
  };

  // making fetch request to the server to post a request for follwing a user
  const handleFollwers = async (item) => {
    const userId = item._id;
    if (userId) {
      const request = await fetch(
        "http://localhost:8022/api/user/updatefollowers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
          body: JSON.stringify({ userId }),
        }
      );
      const response = await request.json();
      setAlertMessage(response.message);
    } else {
      console.log("Handle followers provide userid");
    }
  };

  useEffect(() => {
    allProfiles();
  }, []);

  return (
    <div className="home_container">
      <div className="home_cards">
        <p className="home_headline">Suggest for you</p>
        {profileDetails.length === 0
          ? ""
          : profileDetails.map((item) => {
              return (
                <div className="home_card" key={item.photo + 1}>
                  <div className="home_user_image">
                    <img
                      src={`http://localhost:8022/` + item.photo}
                      alt="home user image"
                    />
                    <div className="home_user_details">
                      <p>{item.name}</p>
                    </div>
                  </div>
                  <div className="home_card_add">
                    <button onClick={() => handleFollwers(item)}>Follow</button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Home;
