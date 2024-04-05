const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";


export const allPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/post/posts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const postsData = await response.json();
        return postsData.posts.reverse()
      } else {
        const error = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return []
    }
  };

 export const createPost = async (inputs) => {
    const response = await fetch(API_URL + "/post/create", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: inputs,
      credentials: "include",
    });

    console.log("ddddd")

    if (response.ok) {
      const post = await response.json();
      console.log (post)
      return post;
    } else {
      const error = await response.json();
      console.log(error);
      return null;
    }
  };

  export const likeOrUnlike = async (inputs) => {
    console.log(inputs)
    const response = await fetch(API_URL + "/post/likeOrUnlike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
      credentials: "include",
    });


    if (response.ok) {
      const post = await response.json();
      console.log (post)
      return post;
    } else {
      const error = await response.json();
      console.log(error);
      return null;
    }
  };