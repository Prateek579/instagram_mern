import React, { useContext, useEffect, useState } from "react";
import "./post.css";
import storeContext from "../../../context/store";

const Post = () => {
  const context = useContext(storeContext);
  const { userToken, setAlertMessage, setTotalUserPost } = context;

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imagesPath, setImagesPath] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedPhoto);
    if (selectedPhoto) {
      const response = await fetch(
        "http://localhost:8022/api/image/postimage",
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
      setSelectedPhoto(null);
      getAllUserPost();
    } else {
      setAlertMessage("please select a photo");
    }
  };


  // making request to fetch all the imgaes uploaded by user 
  const getAllUserPost = async () => {
    try {
      const request = await fetch(
        "http://localhost:8022/api/image/userimages",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        }
      );
      const response = await request.json();
      setImagesPath(response.allImages);
    setTotalUserPost(response.allImages.length)
      
    } catch (error) {
      console.log("getalluserpost error", error);
    }
  };

  const deletePostImage = async (data) => {
    const imageId = data._id;
    const request = await fetch("http://localhost:8022/api/image/deleteimage", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": userToken,
      },
      body: JSON.stringify({imageId}),
    });
    const response = await request.json();
    setAlertMessage(response.message)
    getAllUserPost();
  };

  useEffect(() => {
    getAllUserPost();
  }, []);

  return (
    <div className="post_container">
      <div className="post_cards">
        {imagesPath.length === 0
          ? ""
          : imagesPath.map((element) => {
              return (
                <div className="post_card" key={element.user}>
                  <div
                    className="post_card_delete"
                    onClick={() => deletePostImage(element)}
                  >
                    <i class="fa-solid fa-trash-arrow-up"></i>
                  </div>
                  <img
                    src={`http://localhost:8022/` + element.photo}
                    alt="userPost"
                  />
                </div>
              );
            })}
        <div className="post_card">
          <div className="post_card_center">
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="post_card_form"
            >
              <label htmlFor="post-file-upload" className="post_card_label">
                <input
                  id="post-file-upload"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="photo"
                  onChange={(e) => setSelectedPhoto(e.target.files[0])}
                />
                <i className="fa-solid fa-plus"></i>
              </label>
              <button className="post_card_upload" type="submit">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
