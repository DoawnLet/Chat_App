import axios, { AxiosError } from "axios";
// Removed import of Next.js Error component

type Problem = {
  message?: string;
  detail?: string;
  title?: string;
  error?: string;
};

// Function để extract error message từ nhiều nguồn khác nhau
export function getErrorMessage(err: unknown): string {
  // Lỗi do bạn ném: new Error('msg') hoặc HttpError
  if (err instanceof Error) return err.message;

  // Lỗi Axios (HTTP), cố gắng lấy message từ body
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<Problem>;
    const data = ax.response?.data;
    return (
      data?.message ||
      data?.detail ||
      data?.title ||
      data?.error || // Cho HttpError responses
      ax.message ||
      "Đã có lỗi xảy ra"
    );
  }

  // Trường hợp string thuần
  if (typeof err === "string") return err;

  return "Đã có lỗi xảy ra";
}

const axiosConnected = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, //QUan trọng cho cookie-based auth
});

// Request interceptor: cookie JWT là HttpOnly nên browser JS không đọc được.
axiosConnected.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lí errors
axiosConnected.interceptors.response.use(
  (response) => response,
  (error) => {
    // Fixed typo: error.response (không phải error.reponse)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosConnected;
