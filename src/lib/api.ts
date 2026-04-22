const API_BASE = "/api";

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("impactsphere_token");
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // --- Health ---
  health() {
    return this.request<{ status: string; message: string; database: string }>("/health");
  }

  // --- Auth ---
  register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.request<{ _id: string; name: string; email: string; role: string; token: string }>("/auth/register", { method: "POST", body: data });
  }

  login(data: { email: string; password: string }) {
    return this.request<{ _id: string; name: string; email: string; role: string; token: string }>("/auth/login", { method: "POST", body: data });
  }

  getMe() {
    return this.request<any>("/auth/me");
  }

  // --- Donations ---
  getDonations() {
    return this.request<any[]>("/donations");
  }

  createDonation(data: { amount: number; category: string; donorName?: string; donorEmail?: string }) {
    return this.request<any>("/donations", { method: "POST", body: data });
  }

  getDonationStats() {
    return this.request<{ id: string; label: string; raised: number; goal: number }[]>("/donations/stats");
  }

  // --- Volunteers ---
  getVolunteers() {
    return this.request<any[]>("/volunteers");
  }

  registerVolunteer(data: { name: string; email: string; phone: string; skills?: string }) {
    return this.request<any>("/volunteers", { method: "POST", body: data });
  }

  getVolunteerTasks() {
    return this.request<any[]>("/volunteers/tasks");
  }

  // --- Food Donations ---
  getFoodDonations() {
    return this.request<any[]>("/food-donations");
  }

  createFoodDonation(data: { title: string; mealType: string; mealsCount: number; emoji?: string; scheduledDate?: string; location?: string }) {
    return this.request<any>("/food-donations", { method: "POST", body: data });
  }

  getFoodDonationStats() {
    return this.request<{ totalMeals: number; byType: any[] }>("/food-donations/stats");
  }

  // --- Talents ---
  getTalents() {
    return this.request<any[]>("/talents");
  }

  // --- Events ---
  getEvents() {
    return this.request<any[]>("/events");
  }

  registerForEvent(eventId: string) {
    return this.request<any>(`/events/${eventId}/register`, { method: "POST" });
  }

  // --- Children ---
  getChildren() {
    return this.request<any[]>("/children");
  }

  getChildrenStats() {
    return this.request<{ avgEducation: number; avgHealth: number; totalChildren: number }>("/children/stats");
  }

  // --- Admin ---
  getDashboardStats() {
    return this.request<any>("/admin/dashboard");
  }

  getRecentActivity(limit = 10) {
    return this.request<any[]>(`/admin/activity?limit=${limit}`);
  }
}

export const api = new ApiClient(API_BASE);
export default api;
