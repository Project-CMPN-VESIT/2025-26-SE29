import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// ─── Donations ───────────────────────────────────────────
export function useDonationStats() {
  return useQuery({
    queryKey: ["donationStats"],
    queryFn: () => api.getDonationStats(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; category: string; donorName?: string; donorEmail?: string }) =>
      api.createDonation(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donationStats"] });
    },
  });
}

// ─── Volunteers ──────────────────────────────────────────
export function useVolunteerTasks() {
  return useQuery({
    queryKey: ["volunteerTasks"],
    queryFn: () => api.getVolunteerTasks(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRegisterVolunteer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; phone: string; skills?: string }) =>
      api.registerVolunteer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteerTasks"] });
    },
  });
}

// ─── Food Donations ─────────────────────────────────────
export function useFoodDonations() {
  return useQuery({
    queryKey: ["foodDonations"],
    queryFn: () => api.getFoodDonations(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useFoodDonationStats() {
  return useQuery({
    queryKey: ["foodDonationStats"],
    queryFn: () => api.getFoodDonationStats(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateFoodDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; mealType: string; mealsCount: number; emoji?: string; scheduledDate?: string; location?: string }) =>
      api.createFoodDonation(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["foodDonations"] });
      qc.invalidateQueries({ queryKey: ["foodDonationStats"] });
    },
  });
}

// ─── Talents ─────────────────────────────────────────────
export function useTalents() {
  return useQuery({
    queryKey: ["talents"],
    queryFn: () => api.getTalents(),
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── Events ──────────────────────────────────────────────
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => api.getEvents(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => api.registerForEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// ─── Children ────────────────────────────────────────────
export function useChildren() {
  return useQuery({
    queryKey: ["children"],
    queryFn: () => api.getChildren(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useChildrenStats() {
  return useQuery({
    queryKey: ["childrenStats"],
    queryFn: () => api.getChildrenStats(),
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── Admin ───────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => api.getDashboardStats(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: ["recentActivity", limit],
    queryFn: () => api.getRecentActivity(limit),
    staleTime: 15_000,
    retry: 1,
  });
}
