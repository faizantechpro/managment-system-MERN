export type Item = Record<string, any>;
export type PrimaryKey = string | number;

export type Pagination = {
  limit: number;
  page: number;
  search?: string;
  filter?: string;
  order?: string[] | any;
  [K: string]: any;
};

export type PaginationResponse = {
  pagination: {
    limit: number;
    page: number;
    totalPages: number;
    count: number;
  };
};

export type LeaderboardData = {
  user_id: string;
  pointsEarned: number;
  completedLessons: number;
  pendingLessons: number;
};

export type LeaderboardUserData = {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
};
