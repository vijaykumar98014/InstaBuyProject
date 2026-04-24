import axios from "axios";

// ─── Axios Instances ────────────────────────────────────────────────────────

export const userAPI = axios.create({
  baseURL: "http://localhost:8091",
  headers: { "Content-Type": "application/json" },
});

export const jobAPI = axios.create({
  baseURL: "http://localhost:8092",
  headers: { "Content-Type": "application/json" },
});

export const applicationAPI = axios.create({
  baseURL: "http://localhost:8093",
  headers: { "Content-Type": "application/json" },
});

export const offerAPI = axios.create({
  baseURL: "http://localhost:8083",
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor (attach token if present) ──────────────────────────

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

[userAPI, jobAPI, applicationAPI, offerAPI].forEach((instance) => {
  instance.interceptors.request.use(attachToken, (error) =>
    Promise.reject(error)
  );
});

// ─── Response Interceptor (global error handling) ───────────────────────────

const handleResponseError = (error) => {
  if (error.response) {
    console.error(
      `[API Error] ${error.response.status}: ${error.response.data?.message || error.message}`
    );
  } else {
    console.error("[API Error] Network error:", error.message);
  }
  return Promise.reject(error);
};

[userAPI, jobAPI, applicationAPI, offerAPI].forEach((instance) => {
  instance.interceptors.response.use((res) => res, handleResponseError);
});

// ─── User Service Endpoints ─────────────────────────────────────────────────

export const userService = {
  login: (credentials) => userAPI.post("/api/users/login", credentials),
  signup: (userData) => userAPI.post("/api/users/signup", userData),
  getUserById: (id) => userAPI.get(`/api/users/${id}`),
  getAllUsers: () => userAPI.get("/api/users"),
};

// ─── Job Service Endpoints ──────────────────────────────────────────────────

export const jobService = {
  getAllJobs: () => jobAPI.get("/api/jobs"),
  getJobById: (id) => jobAPI.get(`/api/jobs/${id}`),
  createJob: (jobData) => jobAPI.post("/api/jobs", jobData),
  updateJob: (id, jobData) => jobAPI.put(`/api/jobs/${id}`, jobData),
  approveJob: (id) => jobAPI.patch(`/api/jobs/${id}/approve`),
  deleteJob: (id) => jobAPI.delete(`/api/jobs/${id}`),
};

// ─── Application Service Endpoints ─────────────────────────────────────────

export const applicationService = {
  applyForJob: (applicationData) =>
    applicationAPI.post("/api/applications", applicationData),
  getApplicationsByUser: (userId) =>
    applicationAPI.get(`/api/applications/user/${userId}`),
  getAllApplications: () => applicationAPI.get("/api/applications"),
  getApplicationsByJob: (jobId) =>
    applicationAPI.get(`/api/applications/job/${jobId}`),
  updateApplicationStatus: (id, status) =>
    applicationAPI.patch(`/api/applications/${id}/status`, { status }),
  scheduleInterview: (id, interviewData) =>
    applicationAPI.patch(`/api/applications/${id}/interview`, interviewData),
};

// ─── Offer Service Endpoints ────────────────────────────────────────────────

export const offerService = {
  createOffer: (offerData) => offerAPI.post("/api/offers", offerData),
  getOfferByApplication: (applicationId) =>
    offerAPI.get(`/api/offers/application/${applicationId}`),
  getOffersByUser: (userId) => offerAPI.get(`/api/offers/user/${userId}`),
  getAllOffers: () => offerAPI.get("/api/offers"),
  updateOfferStatus: (id, status) =>
    offerAPI.patch(`/api/offers/${id}/status`, { status }),
};