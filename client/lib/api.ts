import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface School {
  tt: number;
  name: string;
  quota: number;
  nv1: number;
  nv2: number;
  nv3: number;
  total: number;
  ratio: number;
}

export interface Stats {
  total_schools: number;
  total_quota: number;
  total_nv1: number;
  total_nv2: number;
  total_nv3: number;
  total_aspirations: number;
  ratio: {
    mean: number;
    median: number;
    min: number;
    max: number;
    std: number;
  };
  above_avg_ratio: number;
  below_avg_ratio: number;
  highly_competitive: number;
  nv1_vs_quota_ratio: number;
}

export interface Distribution {
  bins: Array<{
    label: string;
    lo: number;
    hi: number;
    count: number;
  }>;
}

// API Functions
export const schoolsApi = {
  getAll: async (params?: {
    name?: string;
    sort_by?: string;
    sort_dir?: string;
    ratio_min?: number;
    ratio_max?: number;
    quota_min?: number;
    quota_max?: number;
  }) => {
    const { data } = await api.get<{ count: number; data: School[] }>("/api/schools", { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<School>(`/api/schools/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get<Stats>("/api/stats");
    return data;
  },

  getDistribution: async (bins: number = 12) => {
    const { data } = await api.get<Distribution>("/api/distribution", { params: { bins } });
    return data;
  },

  getTop: async (by: string = "ratio", n: number = 15, dir: string = "desc") => {
    const { data } = await api.get<{ data: School[] }>("/api/top", {
      params: { by, n, dir },
    });
    return data.data;
  },

  getRankings: async (category: string = "all", limit: number = 20) => {
    const { data } = await api.get("/api/rankings", { params: { category, limit } });
    return data;
  },

  getSchoolDetail: async (id: number) => {
    const { data } = await api.get(`/api/school-detail/${id}`);
    return data;
  },

  compare: async (ids: number[]) => {
    const { data } = await api.get("/api/compare", {
      params: { ids: ids.join(",") },
    });
    return data;
  },

  getAnalysis: async () => {
    const { data } = await api.get("/api/analysis");
    return data;
  },

  getRegression: async () => {
    const { data } = await api.get("/api/regression");
    return data;
  },
};

// Legacy export for backward compatibility
export const fetchSchools = async () => {
  const response = await schoolsApi.getAll();
  return response.data;
};
