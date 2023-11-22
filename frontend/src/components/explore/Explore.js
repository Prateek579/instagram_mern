import React, { useEffect, useState } from "react";
import "./explore.css";

const Explore = () => {
  const [exploreImages, setExploreImages] = useState([]);

  const allExploreImages = async (req, res) => {
    const request = await fetch("http://localhost:8022/api/image/allimages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    setExploreImages(response.images);
  };

  useEffect(() => {
    allExploreImages();
  }, []);

  return (
    <div className="explore_container">
      <div className="explore_images">
        {exploreImages.length === 0
          ? ""
          : exploreImages.map((item) => {
              return (
                <div className="explore_image" key={item.photo}>
                  <img
                    src={`http://localhost:8022/` + item.photo}
                    alt="explore-image"
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Explore;
