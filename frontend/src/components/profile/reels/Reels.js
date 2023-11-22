import React, { useContext, useEffect, useState } from "react";
import "./reels.css";
import storeContext from "../../../context/store";
const Reels = () => {
  const context = useContext(storeContext);
  const { setAlertMessage, userToken } = context;

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [allReels, setAllReels] = useState([]);

  // making fetch request to upload one video to store in database along with user id
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", selectedVideo);
    if (selectedVideo) {
      const response = await fetch(
        "http://localhost:8022/api/video/postvideo",
        {
          method: "POST",
          headers: {
            "auth-token": userToken,
          },
          body: formData,
        }
      );
      const json = await response.json();
      setAlertMessage(json.message);
      setSelectedVideo(null);
      allUserVideos();
    } else {
      setAlertMessage("please select a photo");
    }
  };

  //making fetch request to get all videos uploaded by user
  const allUserVideos = async () => {
    const response = await fetch("http://localhost:8022/api/video/uservideos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": userToken,
      },
    });
    const json = await response.json();
    setAllReels(json.allVideos);
  };


  // delteting video from user data
  const handleDeleteVideo = async (data) => {
    const videoId = data._id;
    const request = await fetch("http://localhost:8022/api/video/deleteVideo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": userToken,
      },
      body: JSON.stringify({ videoId }),
    });
    const response = await request.json();
    setAlertMessage(response.message);
    allUserVideos()
  };

  useEffect(() => {
    allUserVideos();
  }, []);

  return (
    <div className="reels_container">
      <div className="reels_items">
        {allReels.length === 0
          ? ""
          : allReels.map((item) => {
              return (
                <div className="reels_item">
                  <video
                    className="reels_item_video"
                    src={`http://localhost:8022/` + item.video}
                    controls
                  ></video>
                  <div
                    className="reels_item_bottom"
                    onClick={() => handleDeleteVideo(item)}
                  >
                    <i class="fa-solid fa-trash-arrow-up"></i>
                  </div>
                </div>
              );
            })}
        <div className="reels_item">
          <form
            className="reels_form"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <label htmlFor="reels-file-upload" className="reels_form_label">
              <input
                id="reels-file-upload"
                type="file"
                accept=".mp4, .mkv"
                name="video"
                onChange={(e) => setSelectedVideo(e.target.files[0])}
              />
              <i className="fa-solid fa-plus"></i>
            </label>
            <div className="reels_form_btn">
              <button type="submit">Upload reel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reels;
