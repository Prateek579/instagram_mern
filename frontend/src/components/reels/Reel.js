import React, { useState } from "react";
import "./reel.css";

const Reel = () => {
  const [allVideos, setAllVideos] = useState([]);

  const getAllVideos = async () => {
    const request = await fetch("http://localhost:8022/api/video/allvideos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await request.json();
    setAllVideos(json.videos);
  };

  useState(() => {
    getAllVideos();
  }, []);

  return (
    <div className="reel_content">
      <div className="reel_cards">
        {allVideos.length === 0
          ? ""
          : allVideos.map((item) => {
              return (
                <div className="reel_card" key={item.video + 12}>
                  <video
                    className="reels_card_video"
                    src={`http://localhost:8022/` + item.video}
                    controls
                  ></video>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Reel;
