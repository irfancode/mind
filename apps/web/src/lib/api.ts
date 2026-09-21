const API_BASE = "/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("mind_token", token);
    } else {
      localStorage.removeItem("mind_token");
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("mind_token");
    }
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async register(data: {
    displayName: string;
    preferredLanguages: string[];
    ageGroup: string;
    feedVibe: string;
  }) {
    const result = await this.request<{ user: any; token: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    );
    this.setToken(result.token);
    return result;
  }

  async getMe() {
    return this.request<{ user: any }>("/auth/me");
  }

  async getFeed(cursor?: string) {
    const params = cursor ? `?cursor=${cursor}` : "";
    return this.request<{ feed: any }>(`/feed${params}`);
  }

  async createThought(data: {
    type: string;
    content: string;
    replyToId?: string;
  }) {
    return this.request<{ thought: any; moderation: any }>(
      "/thoughts",
      { method: "POST", body: JSON.stringify(data) }
    );
  }

  async getThought(id: string) {
    return this.request<{ thought: any }>(`/thoughts/${id}`);
  }

  async deleteThought(id: string) {
    return this.request<{ success: boolean }>(`/thoughts/${id}`, {
      method: "DELETE",
    });
  }

  async addReaction(thoughtId: string, type: string) {
    return this.request<{ reaction?: any; removed?: boolean; type: string }>(
      "/reactions",
      { method: "POST", body: JSON.stringify({ thoughtId, type }) }
    );
  }

  async shareThought(data: {
    thoughtId: string;
    intent: string;
    addedContext?: string;
  }) {
    return this.request<{ share: any }>("/shares", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async followUser(userId: string) {
    return this.request<{ following: boolean }>(`/follow/${userId}`, {
      method: "POST",
    });
  }

  async getProfile(userId: string) {
    return this.request<{ user: any }>(`/users/${userId}/profile`);
  }

  async getUserThoughts(userId: string, cursor?: string) {
    const params = cursor ? `?cursor=${cursor}` : "";
    return this.request<{ thoughts: any[] }>(
      `/users/${userId}/thoughts${params}`
    );
  }

  async getTrustPassport(userId: string) {
    return this.request<{ passport: any }>(`/trust/passport/${userId}`);
  }

  async getContext(thoughtId: string) {
    return this.request<{ context: any }>(
      `/thoughts/${thoughtId}/context`
    );
  }

  async reportContent(data: {
    thoughtId?: string;
    userId?: string;
    category: string;
    description: string;
  }) {
    return this.request<{ report: any }>("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async whyAmISeeingThis(thoughtId: string) {
    return this.request<{ reason: string; factors: string[] }>(
      `/feed/why?thoughtId=${thoughtId}`
    );
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient();
