import API from "./index";

export const fetchPosts = (page, searchQuery) => {
  if (searchQuery && page) {
    return API.get(`/posts?page=${page}&search=${searchQuery}`);
  }
  if (page) {
    return API.get(`/posts?page=${page}`);
  }
  return API.get(`/posts`);
};

export const fetchPostById = (id) => API.get(`/posts/${id}`);

export const createPost = (formInformations) => {
  return API.post("/posts", formInformations, {
    headers: {
      Authorization: `Bearer: ${JSON.parse(localStorage.getItem("token"))}`,
    },
  });
};

export const deletePost = (id) => {
  return API.delete(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer: ${JSON.parse(localStorage.getItem("token"))}`,
    },
  });
};

export const likePost = (id) => {
  return API.put(
    `/posts/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer: ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }
  );
};

export const updatePost = (id, post) => {
  return API.put(`/posts/${id}`, post, {
    headers: {
      Authorization: `Bearer: ${JSON.parse(localStorage.getItem("token"))}`,
    },
  });
};
