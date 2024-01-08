const fetchPostsData = async () => {
  try {
    const response = await fetch("https://dummyjson.com/posts");
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Помилка отримання даних :", error);
    throw error;
  }
};

export default fetchPostsData;
