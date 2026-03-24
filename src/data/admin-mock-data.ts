// Mock data for admin panel demo/walkthrough mode

export const mockOrders = [
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", user_id: "u1a2b3c4-d5e6-f789-0abc-def123456789", country: "United Arab Emirates", country_code: "AE", plan_data: "5GB", plan_validity: "30 days", plan_speed: "5G", plan_price: 24.99, discount_code: "WELCOME10", discount_amount: 2.50, status: "active", data_used: 1.8, data_total: 5, expires_at: "2026-04-20T00:00:00Z", created_at: "2026-03-22T14:30:00Z" },
  { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", user_id: "u2b3c4d5-e6f7-8901-abcd-ef2345678901", country: "Turkey", country_code: "TR", plan_data: "10GB", plan_validity: "30 days", plan_speed: "4G", plan_price: 19.99, discount_code: null, discount_amount: null, status: "active", data_used: 4.2, data_total: 10, expires_at: "2026-04-18T00:00:00Z", created_at: "2026-03-21T09:15:00Z" },
  { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", user_id: "u3c4d5e6-f7a8-9012-bcde-f13456789012", country: "United Kingdom", country_code: "GB", plan_data: "3GB", plan_validity: "7 days", plan_speed: "5G", plan_price: 12.99, discount_code: "SAVE5", discount_amount: 5.00, status: "active", data_used: 0.5, data_total: 3, expires_at: "2026-03-28T00:00:00Z", created_at: "2026-03-20T17:45:00Z" },
  { id: "d4e5f6a7-b8c9-0123-defa-234567890123", user_id: "u1a2b3c4-d5e6-f789-0abc-def123456789", country: "Saudi Arabia", country_code: "SA", plan_data: "20GB", plan_validity: "30 days", plan_speed: "5G", plan_price: 39.99, discount_code: null, discount_amount: null, status: "active", data_used: 12.3, data_total: 20, expires_at: "2026-04-15T00:00:00Z", created_at: "2026-03-18T11:00:00Z" },
  { id: "e5f6a7b8-c9d0-1234-efab-345678901234", user_id: "u4d5e6f7-a8b9-0123-cdef-124567890123", country: "Egypt", country_code: "EG", plan_data: "5GB", plan_validity: "15 days", plan_speed: "4G", plan_price: 14.99, discount_code: "WELCOME10", discount_amount: 1.50, status: "expired", data_used: 5, data_total: 5, expires_at: "2026-03-10T00:00:00Z", created_at: "2026-02-25T08:20:00Z" },
  { id: "f6a7b8c9-d0e1-2345-fabc-456789012345", user_id: "u5e6f7a8-b9c0-1234-defa-235678901234", country: "Germany", country_code: "DE", plan_data: "10GB", plan_validity: "30 days", plan_speed: "5G", plan_price: 29.99, discount_code: null, discount_amount: null, status: "active", data_used: 7.1, data_total: 10, expires_at: "2026-04-12T00:00:00Z", created_at: "2026-03-15T20:10:00Z" },
  { id: "a7b8c9d0-e1f2-3456-abcd-567890123456", user_id: "u2b3c4d5-e6f7-8901-abcd-ef2345678901", country: "France", country_code: "FR", plan_data: "3GB", plan_validity: "7 days", plan_speed: "4G", plan_price: 11.99, discount_code: null, discount_amount: null, status: "expired", data_used: 3, data_total: 3, expires_at: "2026-03-05T00:00:00Z", created_at: "2026-02-28T13:40:00Z" },
  { id: "b8c9d0e1-f2a3-4567-bcde-678901234567", user_id: "u6f7a8b9-c0d1-2345-efab-346789012345", country: "United States", country_code: "US", plan_data: "15GB", plan_validity: "30 days", plan_speed: "5G", plan_price: 34.99, discount_code: "SAVE5", discount_amount: 5.00, status: "active", data_used: 2.4, data_total: 15, expires_at: "2026-04-22T00:00:00Z", created_at: "2026-03-23T06:55:00Z" },
];

export const mockUsers = [
  { id: "u1a2b3c4-d5e6-f789-0abc-def123456789", email: "sarah.ahmed@gmail.com", created_at: "2026-02-10T08:00:00Z", last_sign_in_at: "2026-03-23T14:30:00Z" },
  { id: "u2b3c4d5-e6f7-8901-abcd-ef2345678901", email: "mehmet.yilmaz@outlook.com", created_at: "2026-02-15T12:00:00Z", last_sign_in_at: "2026-03-22T09:15:00Z" },
  { id: "u3c4d5e6-f7a8-9012-bcde-f13456789012", email: "james.wilson@yahoo.com", created_at: "2026-02-20T16:00:00Z", last_sign_in_at: "2026-03-21T17:45:00Z" },
  { id: "u4d5e6f7-a8b9-0123-cdef-124567890123", email: "fatima.hassan@gmail.com", created_at: "2026-02-22T10:00:00Z", last_sign_in_at: "2026-03-18T08:20:00Z" },
  { id: "u5e6f7a8-b9c0-1234-defa-235678901234", email: "thomas.mueller@web.de", created_at: "2026-03-01T14:00:00Z", last_sign_in_at: "2026-03-20T20:10:00Z" },
  { id: "u6f7a8b9-c0d1-2345-efab-346789012345", email: "emily.chen@icloud.com", created_at: "2026-03-10T09:00:00Z", last_sign_in_at: "2026-03-23T06:55:00Z" },
  { id: "c7efa09b-f893-4bf0-9af1-21f20e36d32a", email: "info@eblock6.com", created_at: "2026-03-23T04:12:00Z", last_sign_in_at: "2026-03-24T04:14:00Z" },
];

export const mockReferralCodes = [
  { id: "r1a2b3c4", user_id: "u1a2b3c4-d5e6-f789-0abc-def123456789", code: "CAMELSARAH", referral_count: 5, reward_value: 10, reward_type: "percentage", friend_discount_value: 10, friend_discount_type: "percentage", created_at: "2026-02-10T08:00:00Z" },
  { id: "r2b3c4d5", user_id: "u2b3c4d5-e6f7-8901-abcd-ef2345678901", code: "CAMELMEHMET", referral_count: 3, reward_value: 10, reward_type: "percentage", friend_discount_value: 10, friend_discount_type: "percentage", created_at: "2026-02-15T12:00:00Z" },
  { id: "r3c4d5e6", user_id: "u5e6f7a8-b9c0-1234-defa-235678901234", code: "CAMELTHOMAS", referral_count: 1, reward_value: 10, reward_type: "percentage", friend_discount_value: 10, friend_discount_type: "percentage", created_at: "2026-03-01T14:00:00Z" },
  { id: "r4d5e6f7", user_id: "u6f7a8b9-c0d1-2345-efab-346789012345", code: "CAMELEMILY", referral_count: 0, reward_value: 10, reward_type: "percentage", friend_discount_value: 10, friend_discount_type: "percentage", created_at: "2026-03-10T09:00:00Z" },
  { id: "r5e6f7a8", user_id: "c7efa09b-f893-4bf0-9af1-21f20e36d32a", code: "CAMELVDQ5GF", referral_count: 0, reward_value: 10, reward_type: "percentage", friend_discount_value: 10, friend_discount_type: "percentage", created_at: "2026-03-23T04:12:00Z" },
];

export const mockStats = {
  total_orders: 8,
  total_revenue: 174.93,
  total_users: 7,
  active_orders: 6,
  total_referrals: 9,
};

// Helper to compute order summaries for users
export function getMockOrderSummaries() {
  const summaries: Record<string, { user_id: string; count: number; total: number }> = {};
  mockOrders.forEach((o) => {
    if (!summaries[o.user_id]) summaries[o.user_id] = { user_id: o.user_id, count: 0, total: 0 };
    summaries[o.user_id].count++;
    summaries[o.user_id].total += o.plan_price;
  });
  return summaries;
}
