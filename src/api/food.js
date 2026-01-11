import axios from "./axios";

export const addFood = async (data) => {
  const res = await axios.post("/api/food/add", data);
  return res.data;
};

export const getMyFoods = async () => {
  const res = await axios.get("/api/food/my-foods");
  return res.data;
};

export const updateFood = async (foodId, data) => {
  const res = await axios.put(`/api/food/update/${foodId}`, data);
  return res.data;
};

export const deleteFood = async (foodId) => {
  const res = await axios.delete(`/api/food/delete/${foodId}`);
  return res.data;
};

export const getDonorStats = async () => {
  const res = await axios.get("/api/food/donor-stats");
  return res.data;
};
/*
export const getAllFoods = async (page = 1) => {
  const res = await axios.get(
    `/api/food/all-foods?page=${page}&limit=5`
  );
  return res.data;
};
*/

export const getAvailableFoods = async () => {
  const res = await axios.get("/api/food/available");
  return res.data;
};

export const reserveFood = async (foodId) => {
  return axios.post(`/api/food/reserve/${foodId}`);
};

export const getVolunteerProfile = async () => {
  const res = await axios.get("/api/food/volunteer/profile");
  return res.data;
};

export const getVolunteerDeliveries = async () => {
  const res = await axios.get("/api/food/volunteer/deliveries");
  return res.data;
};


export const getPlatformStats = async () => {
  const res = await axios.get("/api/food/platform/stats");
  return res.data;
};

export const getDonorProfile = async () => {
  const res = await axios.get("/api/food/donor/profile");
  return res.data;
};

export const getPublicStats = async () => {
  const res = await axios.get("/api/food/public/stats");
  return res.data;
};

export const getPublicDonors = async () => {
  const res = await axios.get("/api/food/public/donors");
  return res.data;
};

export const getPublicDeliveries = async () => {
  const res = await axios.get("/api/food/public/deliveries");
  return res.data;
};

export const getPublicVolunteers = async () => {
  const res = await axios.get("/api/food/public/volunteers");
  return res.data;
};
