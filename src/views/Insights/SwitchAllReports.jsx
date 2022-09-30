import LessonsStartedCompleted from './LessonsStartedCompleted';
import PopularLessons from './PopularLessons';
import DealsPerformance from './DealsPerformance';
// TODO fix these reports after deal_stage update
// import DealsProgress from './DealsProgress';
// import DealsConversion from './DealsConversion';
// import DealsDuration from './DealDuration';
import ActiveTrainingUsers from './ActiveTrainingUsers';
import LessonLeaderboard from './LessonLeaderboard';
import LessonsPending from './LessonsPending';
import LessonAttempts from './LessonAttempts';
import TrainingsCompleted from './TrainingsCompleted';
import TopLessons from './TopLessons';
import CategoryAttempts from './CategoryAttempts';
import { InsightsTable } from './components';

const ACTIVE_TRAINING_USERS = 'Active Training Users';
const CATEGORY_ATTEMPTS = 'Category Attempts';
const DEALS_PERFORMANCE = 'Deals Performance';
const LESSON_ATTEMPTS = 'Lesson Attempts';
const LESSON_LEADERBOARD = 'Lesson Leaderboard';
const LESSONS_STARTED_AND_COMPLETED = 'Lessons Started and Completed';
const LESSONS_PENDING = 'Lessons Pending';
const POPULAR_LESSONS = 'Popular Lessons';
const TRAININGS_COMPLETED = 'Trainings Completed';
const TOP_LESSONS = 'Top Lessons';

export const processableExamples = {
  'Top 25 Users by Lessons Completed - Last 90 Day': ACTIVE_TRAINING_USERS,
  'Top 25 Categories by Lessons Attempted - Last 90 Day': CATEGORY_ATTEMPTS,
  'Count of Deals by Status - Last 6 Months': DEALS_PERFORMANCE,
  'Top 25 Lessons Attempted - Last 90 Day': LESSON_ATTEMPTS,
  'Top 25 Users by Lesson Points - Last 90 Day': LESSON_LEADERBOARD,
  'Daily Lesson Completion Rate - Last 7 Day': LESSONS_STARTED_AND_COMPLETED,
  'Top 25 Lessons in Progress - Last 90 Day': LESSONS_PENDING,
  'Top Categories by Lesson Progress': POPULAR_LESSONS,
  'Top 25 Lessons Completed - Last 90 Day': TRAININGS_COMPLETED,
  'Top 25 Lessons In Progress - Last 90 Day': TOP_LESSONS,
};

export const SwitchAllReports = (props) => {
  if (props.insightName === LESSONS_STARTED_AND_COMPLETED) {
    return <LessonsStartedCompleted {...props} />;
  } else if (props.insightName === POPULAR_LESSONS) {
    return <PopularLessons {...props} />;
  }

  let render;
  switch (props.insightName) {
    case ACTIVE_TRAINING_USERS:
      render = ActiveTrainingUsers;
      break;
    case CATEGORY_ATTEMPTS:
      render = CategoryAttempts;
      break;
    case DEALS_PERFORMANCE:
      render = DealsPerformance;
      break;
    case LESSON_ATTEMPTS:
      render = LessonAttempts;
      break;
    case LESSON_LEADERBOARD:
      render = LessonLeaderboard;
      break;
    case LESSONS_PENDING:
      render = LessonsPending;
      break;
    case TOP_LESSONS:
      render = TopLessons;
      break;
    case TRAININGS_COMPLETED:
      render = TrainingsCompleted;
      break;
  }

  if (!render) {
    return;
  }

  return <InsightsTable {...props} render={render} />;
};
