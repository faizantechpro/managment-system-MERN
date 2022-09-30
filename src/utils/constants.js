import copy from '../assets/svg/illustrations/copy.svg';
import print from '../assets/svg/illustrations/print.svg';
import excel from '../assets/svg/brands/excel.svg';
import csvFormat from '../assets/svg/components/placeholder-csv-format.svg';
import pdf from '../assets/svg/brands/pdf.svg';

export const LEADERBOARD_FILTER_TYPES = [
  { key: 'allTime', description: 'All Time' },
  { key: 'weekly', description: 'Last Week' },
  { key: 'monthly', description: 'Last Month' },
];

export const ALL_TIME = 'allTime';
export const WEEKLY = 'weekly';
export const MONTHLY = 'monthly';

export const COMPLETED = 'completed';
export const IN_PROGRESS = 'in_progress';

export const PRIMARY = 'primary';
export const SECONDARY = 'secondary';
export const SUCCESS = 'success';
export const DANGER = 'danger';

export const USERS = 'Users';
export const ADD_USERS = 'Add Users';
export const EMPTY_LEADERBOARD =
  'Be the first to complete a lesson and join the leaderboard!';

export const DEFAULT_LANGUAGE = 'English (US)';
export const SUCCESS_INFO = 'Info updated successfully';
export const UPLOAD_ERROR = 'Error uploading avatar';
export const SERVER_ERROR = 'Server error!! try again or contact to support';
export const LESSON_REMOVED = 'Lesson removed successfuly';
export const TIMEZONE_INFO =
  'Timezone is updated automatically to match your computer timezone.';
export const SAVE = 'Save changes';
export const UPDATE_PROFILE = 'Update profile';
export const UPDATE_USER = 'Update user';
export const ERROR_FIRST_NAME_REQUIRED = 'The first name is required.';
export const ERROR_LAST_NAME_REQUIRED = 'The last name is required.';
export const UPLOAD_AVATAR = 'Upload Avatar';
export const LOGIN_INFO = 'Your login info';
export const CHANGE_LOGIN_INFO = ' Change your login info here.';
export const CHANGE_PASSWORD = 'Change your password';
export const CHANGE_PASSWORD_DESCRIPTION =
  'Keep your data safe by creating a password that is complex and long enough. It should be easy for you to remember but hard for others to guess.';
export const CURRENT_PASSWORD = 'Current password';
export const NEW_PASSWORD = 'New password';
export const CONFIRM_NEW_PASSWORD = 'Confirm new password';
export const PASSWORD_REQUIREMENTS = 'Password requirements:';
export const OTHER_RECOMMENDED_LESSONS = 'Other Recommended Lessons';
export const CONGRATULATIONS = 'Congratulations';
export const DEFAULT_ICONS = 'summarize';
export const CORRECT_LABEL = "You're Correct!";
export const CLOSE = 'close';
export const NOT_QUITE = 'Not quite, but close!';
export const RETAKE_LABEL = 'Retake Lesson';
export const QUIZ = 'quiz';
export const SLIDE = 'slide';
export const QUIZ_REVIEW = 'quiz_review';
export const VIDEO = 'video';
export const COMPLETED_LESSON = 'You completed your lesson.';
export const START_NEW_LESSON = 'Start New Lesson';
export const CONTINUE_LESSON = 'Continue Lesson';
export const START_LESSON = 'Start Lesson';
export const PAGE_CREATE_REQUIRED = 'Page title is required';
export const OPTIONS_LENGTH_ERROR =
  'You must to have at least 2 options and max 5 options';
export const BAD_UPLOAD_VIDEO = 'Bad Format, video was not uploaded';
export const WISTIA_UPLOAD_VIDEO = 'Please provide valid video url.';
export const OPTIONS_ANSWER = 'You should have at least 1 answer';
export const EMPTY_NAME = 'First name and Last name should not empty';
export const EMPTY_ORG_NAME = 'Organization is required';
export const EMPTY_DEAL_NAME = 'Title should not be empty';
export const EMPTY_CURRENCY = 'You should have a currency';
export const OPTIONS_WITHOUT_DESCRIPTION = 'Options should have a description';
export const SEARCH_CONTACTS = 'Search Person';
export const SEARCH_ORGANIZATIONS = 'Search Organizations';
export const SEARCH_ACCOUNTS = 'Search Account';
export const SEARCH_LESSONS = 'Search Lessons';
export const SEARCH_CATEGORIES = 'Search Categories';
export const SEARCH_COURSES = 'Search Courses';
export const SEARCH = 'Search';
export const CONTACT_CREATED = 'Contact Created';
export const DEAL_CONTACT = 'Deal created';
export const CONTACT_PERSON = 'Contact person';
export const SOMETHING_IS_WRONG = 'Something was wrong, try again!';
export const DEAL_UPDATED = 'Deal updated successfully';
export const DEAL_REMOVED = 'Deal removed successfully';
export const PRODUCTS_UPDATED = 'Products updated successfully';
export const REMOVE_PRODUCT_CONFIRM =
  'Are you sure you want to delete this product';
export const ORGANIZATION_CREATED = 'Organization has been created';
export const ORGANIZATION_DELETED = 'Organization has been deleted';
export const PRIMARY_OWNER = 'Primary Owner';
export const EXPECTED_CLOSE_DATE = 'Expected Close Date';
export const AVAILABLE_REPORTS = 'AVAILABLE REPORTS';

export const STREET = 'Street Address';
export const CITY = 'City';
export const STATE = 'State';
export const ZIP_CODE = 'Zip Code';
export const COUNTRY = 'Country';
export const SUITE = 'Suite or P.O. BOX';
export const POINTS_EARNED = 'Points Earned';
export const COMPLETED_LESSONS = 'Completed Lessons';
export const PENDING_LESSONS = 'Pending Lessons';
export const TOTAL_LESSONS = 'Total Lessons';
export const FAVORITE_LESSONS = 'Favorite Lessons';
export const SUBMIT_SUCCESSFULLY = 'Support Ticket Submitted';
export const HELPCENTER_DESCRIPTION =
  'Please submit your request below and we’ll get back to you shortly.';
export const SUPPORT_TICKET = 'Open a support ticket';
export const SEND_MESSAGE = 'Send Message';
export const NAME_LABEL = 'Name';
export const DESCRIPTION_LABEL = 'Description';
export const CREATE_LABEL = 'Create';
export const CANCEL_LABEL = 'Cancel';
export const ROLE_CREATED =
  'The role has been created successfully. Redirecting to set permissions.';
export const ERROR_ROLE_EXIST = 'The role already exist.';
export const ERROR_ROLE_REQUIRED = 'The role name is required.';
export const ADD_NEW_ROLE_LABEL = 'Add New Role';
export const EMAIL_LABEL = 'Email';
export const MESSAGE_LABEL = 'Message';
export const MESSAGE_PLACEHOLDER = 'Add your message';
export const SIGN_OUT = 'Sign out';
export const PROFILE_LABEL = 'Profile';
export const ADD_LABEL = 'add';
export const USERS_REMOVED_NOTIFICATION = 'Users suspended successfully';
export const FILTER_LABEL = 'Filter';
export const FILTER_CARD_TITLE = 'Filter users';
export const FILTER_STATUS = 'Status';
export const FILTER_ROLE = 'Role';
export const FILTER_APPLY = 'Apply';
export const FIRST_SLIDE_PRESENTATION = 'Create your first slide';
export const ADD_SLIDE = 'Add Text';
export const ADD_QUIZ = 'Add Quiz';
export const ADD_VIDEO = 'Add Video';
export const LESSONS = 'Lessons';
export const SAVE_LABEL = 'Save';
export const EMPTY_ITEM = 'You must select almost 1 item';
export const EMPTY_PRICE = 'You must to have price';
export const EMPTY_QUANTITY = 'You must to have quantity';
export const DUPLICATED_ITEMS = 'There are duplicate elements';
export const PREVIEW_LABEL = 'Preview';
export const PUBLISH_LESSON = 'Publish Lesson';
export const UNPUBLISH_LESSON = 'Unpublish Lesson ';
export const PUBLISHED_LESSON = 'Lesson Published';
export const UNPUBLISHED_LESSON = 'Lesson Unpublished';
export const PUBLISHED = 'published';
export const DRAFT = 'draft';
export const ADD_TO_LESSON = 'Add to My Favorites';
export const REMOVE_FROM_FAVORITES = 'Remove from My Favorites';
export const UPLOAD_PDF_TITLE = 'Upload PDF';
export const BADGE_LABEL = 'Badge:';
export const COURSES_COMMING_SOON = 'Category courses coming soon';
export const LESSONS_COMMING_SOON = 'Category lessons coming soon';
export const CHOOSE_FILE = 'Choose file to upload';
export const CHOOSE_PDF_FILE = 'Drag a pdf here';
export const CHOOSE_IMAGE_FILE = 'Drag a file here';
export const BROWSE_FILE = 'Browse file';
export const LESSON_TITLE_LABEL = 'Lesson title';
export const LESSON_CONTENT_LABEL = 'Lesson Contents';
export const LESSON_SETTINGS_LABEL = 'Lesson Settings';
export const LESSON_STATUS_LABEL = 'Lesson Status';
export const SELECT_CATEGORY_LABEL = 'Select Category';
export const SLIDE_DEFAULT_TEXT = 'Slide #1: Slide Name';
export const TITLE_LABEL = 'title';
export const CONTENT_LABEL = 'content';
export const TAG_LABEL = 'tag';
export const MAX_POINTS = 'maxPoints';
export const MAX_ATTEMPS = 'maxAttemps';
export const DURATION = 'duration';
export const SELECT_OPTIONS_DESCRIPTION =
  'Directly select the answer that will be correct.';
export const QUESTION_REVIEW_LABEL = 'Question review';
export const LESSON_CREATE_REQUIRED = 'Lesson Name and Category are required';
export const LESSONS_STARTED_AND_COMPLETED = 'Lessons started and completed';
export const DEALS_CONVERSION = 'Deals conversion';
export const POPULAR_LESSONS = 'Popular Lessons';
export const NEW_STAGE_ID = '$$new$$';
export const MAX_CATEGORY_SELECTED =
  'You cant have more than 10 categories selected';
export const MIN_CATEGORY_SELECTED =
  'You must have at least 1 category selected';
export const ALL_LABEL = 'All';
export const DEALS_DURATION = 'Deals Duration';
export const NO_DATA_YET = 'No data yet';
export const PEOPLE = 'People';
export const CONTACTS = 'People';
export const ADD_PEOPLE = 'Add People';
export const ADD_CONTACT = 'Add Person';
export const CONTACT_DELETED = 'Contact has been deleted';
export const STATUS = 'status';
export const ADDITIONAL_FIELDS_LIMIT = 3;
export const EMAIL_LOCATION = 'email_location';
export const EMAIL_LOCATION_1 = 'email_location_1';
export const EMAIL_LOCATION_2 = 'email_location_2';
export const PHONE_LOCATION = 'phone_location';
export const PHONE_LOCATION_2 = 'phone_location_2';
export const PHONE_LOCATION_3 = 'phone_location_3';
export const PHONE_LOCATION_4 = 'phone_location_4';
export const PRODUCT = 'porduct';
export const ORGANIZATION = 'Organization';
export const SEARCH_FOR_USER = 'Search for person';
export const SEARCH_FOR_ORGANIZATION = 'Search for organization';
export const DEAL_TITLE = 'Deal Title';
export const DEAL_TYPE = 'tenant_deal_stage_id';
export const ORGANIZATION_ID = 'organization_id';
export const ADDRESS_STATE = 'address_state';
export const ADDRESS_STREET = 'address_street';
export const SEARCH_FOR_CATEGORY = 'Search for category';
export const CATEGORY_REQUIRED = 'Category is required.';
export const NO_PRODUCTS = 'None';
export const NO_ORGANIZATION_ASSIGNED =
  'No organization is linked to this deal.';
export const LINK_ORGANIZATION = 'Link to an organization';
export const NO_CONTACT_ASSIGNED = 'None';
export const SEARCH_FOR_CONTACT = 'Search for contact';
export const ADD_DEAL = 'Add Deal';
export const NO_DEAL = 'No Deal';
export const MAX_WEIGHT_ERROR_MESSAGE = 'Maximum file weight allowed is 5MB';
export const MAX_WEIGHT = 5120000;

export const OWNER = 'Owner(s)';
export const ADDRESS = 'Address';
export const DELETE = 'Delete';
export const LESSON_DELETED = 'This lesson was deleted by admin';
export const CANT_REMOVE =
  'You cant remove this lesson, its being taken by someone else ';
export const LESSON_DELETE_CONFIRMATION =
  'Are you sure you want to delete this item? This change is irreversible.';
export const DEAL_DELETE_CONFIRMATION =
  'Are you sure you want to delete this deal? This change is irreversible.';
export const AFFIRMATIVE_ANSWER = 'Yes, Delete';
export const ACCEPT = 'Yes, accept';

export const EXPIRED_INVITATION_ERROR =
  'Your invite link has expired, please obtain a new invitation from the Identifee team.';
export const CREATE_YOUR_ACCOUNT = 'Create your account';

export const INVITE_FORM_TEXT =
  'Invite users to Identifee. You can invite up to 5 users at once. Enter multiple email addresses separated by a comma.';
export const INVITATION_SENT =
  'Invitation has been sent to the following users:';
export const UNKNOWN_ERROR = 'An unknown error has ocurred';
export const PDF_UPLOAD_ERROR = 'Could not save the PDF';
export const PDF_FORMAT_ERROR = 'The Format is invalid';
export const QUIZ_QUESTION_LABEL = 'What is the question?';
export const SHORT_VIDEO_TITLE = 'Watch a Short video';
export const LESSON_UPDATED = 'Lesson Updated';
export const LESSON_CREATED = 'Lesson Created';
export const VIDEO_LINK_FORMAT =
  'https://identifee.wistia.com/medias/jru7iafy58';
export const INVALID_EMAIL = 'Invalid Email';
export const ADD_PERSON = 'Add Person';
export const ADD_ORGANIZATION = 'Add Organization';
export const FILTER_PEOPLE = 'Filter People';
export const FILTER_ORGANIZATION = 'Filter Organizations';
export const LABEL = 'Label';
export const PHONE = 'Phone';
export const ADD_ONE_MORE = 'Add more';
export const EMPTY_DATA = 'No data to show';
export const NO_SEARCH_RESULTS = 'No search results';
export const NO_DATA_AVAILABLE = 'No data available';
export const LEARNING_PATH = 'Learning Path';
export const COURSES_COMMING_SOON_TEXT = 'Courses coming soon';
export const COURSES = 'Courses';
export const PIPELINE = 'Pipeline';
export const QUANTITY = 'Quantity';
export const FILE_REMOVED = 'File Removed';
export const FILE_DOESNT_EXIST =
  "This file was removed or You don't have permission to access this";
export const INTERNAL_SERVER_ERROR = 'Internal server error';
export const DOWNLOAD_STARTED = 'Download started';
export const DOWNLOAD_ERROR = 'Download request failed';
export const ASSIGNED_OWNERS = 'Assigned Owners';
export const PRINCIPAL_OWNER_LABEL = '(Primary)';
export const MORE_INFORMATION = 'For more information: ';

export const DEFAULT_PASSWORD_INFO = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export const REQUIREMENTS_PASSWORD = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one uppercase character',
  'At least one number, symbol, or whitespace character',
];

export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_STRENGTH = {
  default: {
    status: 'Very Weak',
    percentage: 1,
    bgColor: 'danger',
  },
  0: {
    status: 'Very Weak',
    percentage: 1,
    bgColor: 'danger',
  },
  4: {
    status: 'Weak',
    percentage: 20,
    bgColor: 'danger',
  },
  8: {
    status: 'Normal',
    percentage: 40,
    bgColor: 'warning',
  },
  12: {
    status: 'Normal',
    percentage: 60,
    bgColor: 'warning',
  },
  16: {
    status: 'Medium',
    percentage: 80,
    bgColor: 'info',
  },
  20: {
    status: 'Strong',
    percentage: 100,
    bgColor: 'success',
  },
};

export const currencies = [
  { id: 'USD', value: 'USD', title: 'US Dollar (USD)' },
  { id: 'CAD', value: 'CAD', title: 'Canadian Dollar (CAD)' },
  { id: 'EUR', value: 'EUR', title: 'Euro (EUR)' },
  { id: 'AED', value: 'AED', title: 'United Arab Emirates Dirham (AED)' },
  { id: 'AFN', value: 'AFN', title: 'Afghan Afghani (AFN)' },
  { id: 'ALL', value: 'ALL', title: 'Albanian Lek (ALL)' },
  { id: 'AMD', value: 'AMD', title: 'Armenian Dram (AMD)' },
  { id: 'ARS', value: 'ARS', title: 'Argentine Peso (ARS)' },
  { id: 'AUD', value: 'AUD', title: 'Australian Dollar (AUD)' },
  { id: 'AZN', value: 'AZN', title: 'Azerbaijani Manat (AZN)' },
  {
    id: 'BAM',
    value: 'BAM',
    title: 'Bosnia-Herzegovina Convertible Mark (BAM)',
  },
  { id: 'BDT', value: 'BDT', title: 'Bangladeshi Taka (BDT)' },
  { id: 'BGN', value: 'BGN', title: 'Bulgarian Lev (BGN)' },
  { id: 'BHD', value: 'BHD', title: 'Bahraini Dinar (BHD)' },
  { id: 'BIF', value: 'BIF', title: 'Burundian Franc (BIF)' },
  { id: 'BND', value: 'BND', title: 'Brunei Dollar (BND)' },
  { id: 'BOB', value: 'BOB', title: 'Bolivian Boliviano (BOB)' },
  { id: 'BRL', value: 'BRL', title: 'Brazilian Real (BRL)' },
  { id: 'BWP', value: 'BWP', title: 'Botswanan Pula (BWP)' },
  { id: 'BYR', value: 'BYR', title: 'Belarusian Ruble (BYR)' },
  { id: 'BZD', value: 'BZD', title: 'Belize Dollar (BZD)' },
  { id: 'CDF', value: 'CDF', title: 'Congolese Franc (CDF)' },
  { id: 'CHF', value: 'CHF', title: 'Swiss Franc (CHF)' },
  { id: 'CLP', value: 'CLP', title: 'Chilean Peso (CLP)' },
  { id: 'CNY', value: 'CNY', title: 'Chinese Yuan (CNY)' },
  { id: 'COP', value: 'COP', title: 'Colombian Peso (COP)' },
  { id: 'CRC', value: 'CRC', title: 'Costa Rican Colón (CRC)' },
  { id: 'CVE', value: 'CVE', title: 'Cape Verdean Escudo (CVE)' },
  { id: 'CZK', value: 'CZK', title: 'Czech Republic Koruna (CZK)' },
  { id: 'DJF', value: 'DJF', title: 'Djiboutian Franc (DJF)' },
  { id: 'DKK', value: 'DKK', title: 'Danish Krone (DKK)' },
  { id: 'DOP', value: 'DOP', title: 'Dominican Peso (DOP)' },
  { id: 'DZD', value: 'DZD', title: 'Algerian Dinar (DZD)' },
  { id: 'EEK', value: 'EEK', title: 'Estonian Kroon (EEK)' },
  { id: 'EGP', value: 'EGP', title: 'Egyptian Pound (EGP)' },
  { id: 'ERN', value: 'ERN', title: 'Eritrean Nakfa (ERN)' },
  { id: 'ETB', value: 'ETB', title: 'Ethiopian Birr (ETB)' },
  { id: 'GBP', value: 'GBP', title: 'British Pound Sterling (GBP)' },
  { id: 'GEL', value: 'GEL', title: 'Georgian Lari (GEL)' },
  { id: 'GHS', value: 'GHS', title: 'Ghanaian Cedi (GHS)' },
  { id: 'GNF', value: 'GNF', title: 'Guinean Franc (GNF)' },
  { id: 'GTQ', value: 'GTQ', title: 'Guatemalan Quetzal (GTQ)' },
  { id: 'HKD', value: 'HKD', title: 'Hong Kong Dollar (HKD)' },
  { id: 'HNL', value: 'HNL', title: 'Honduran Lempira (HNL)' },
  { id: 'HRK', value: 'HRK', title: 'Croatian Kuna (HRK)' },
  { id: 'HUF', value: 'HUF', title: 'Hungarian Forint (HUF)' },
  { id: 'IDR', value: 'IDR', title: 'Indonesian Rupiah (IDR)' },
  { id: 'ILS', value: 'ILS', title: 'Israeli New Sheqel (ILS)' },
  { id: 'INR', value: 'INR', title: 'Indian Rupee (INR)' },
  { id: 'IQD', value: 'IQD', title: 'Iraqi Dinar (IQD)' },
  { id: 'IRR', value: 'IRR', title: 'Iranian Rial (IRR)' },
  { id: 'ISK', value: 'ISK', title: 'Icelandic Króna (ISK)' },
  { id: 'JMD', value: 'JMD', title: 'Jamaican Dollar (JMD)' },
  { id: 'JOD', value: 'JOD', title: 'Jordanian Dinar (JOD)' },
  { id: 'JPY', value: 'JPY', title: 'Japanese Yen (JPY)' },
  { id: 'KES', value: 'KES', title: 'Kenyan Shilling (KES)' },
  { id: 'KHR', value: 'KHR', title: 'Cambodian Riel (KHR)' },
  { id: 'KMF', value: 'KMF', title: 'Comorian Franc (KMF)' },
  { id: 'KRW', value: 'KRW', title: 'South Korean Won (KRW)' },
  { id: 'KWD', value: 'KWD', title: 'Kuwaiti Dinar (KWD)' },
  { id: 'KZT', value: 'KZT', title: 'Kazakhstani Tenge (KZT)' },
  { id: 'LBP', value: 'LBP', title: 'Lebanese Pound (LBP)' },
  { id: 'LKR', value: 'LKR', title: 'Sri Lankan Rupee (LKR)' },
  { id: 'LTL', value: 'LTL', title: 'Lithuanian Litas (LTL)' },
  { id: 'LVL', value: 'LVL', title: 'Latvian Lats (LVL)' },
  { id: 'LYD', value: 'LYD', title: 'Libyan Dinar (LYD)' },
  { id: 'MAD', value: 'MAD', title: 'Moroccan Dirham (MAD)' },
  { id: 'MDL', value: 'MDL', title: 'Moldovan Leu (MDL)' },
  { id: 'MGA', value: 'MGA', title: 'Malagasy Ariary (MGA)' },
  { id: 'MKD', value: 'MKD', title: 'Macedonian Denar (MKD)' },
  { id: 'MMK', value: 'MMK', title: 'Myanma Kyat (MMK)' },
  { id: 'MOP', value: 'MOP', title: 'Macanese Pataca (MOP)' },
  { id: 'MUR', value: 'MUR', title: 'Mauritian Rupee (MUR)' },
  { id: 'MXN', value: 'MXN', title: 'Mexican Peso (MXN)' },
  { id: 'MYR', value: 'MYR', title: 'Malaysian Ringgit (MYR)' },
  { id: 'MZN', value: 'MZN', title: 'Mozambican Metical (MZN)' },
  { id: 'NAD', value: 'NAD', title: 'Namibian Dollar (NAD)' },
  { id: 'NGN', value: 'NGN', title: 'Nigerian Naira (NGN)' },
  { id: 'NIO', value: 'NIO', title: 'Nicaraguan Córdoba (NIO)' },
  { id: 'NOK', value: 'NOK', title: 'Norwegian Krone (NOK)' },
  { id: 'NPR', value: 'NPR', title: 'Nepalese Rupee (NPR)' },
  { id: 'NZD', value: 'NZD', title: 'New Zealand Dollar (NZD)' },
  { id: 'OMR', value: 'OMR', title: 'Omani Rial (OMR)' },
  { id: 'PAB', value: 'PAB', title: 'Panamanian Balboa (PAB)' },
  { id: 'PEN', value: 'PEN', title: 'Peruvian Nuevo Sol (PEN)' },
  { id: 'PHP', value: 'PHP', title: 'Philippine Peso (PHP)' },
  { id: 'PKR', value: 'PKR', title: 'Pakistani Rupee (PKR)' },
  { id: 'PLN', value: 'PLN', title: 'Polish Zloty (PLN)' },
  { id: 'PYG', value: 'PYG', title: 'Paraguayan Guarani (PYG)' },
  { id: 'QAR', value: 'QAR', title: 'Qatari Rial (QAR)' },
  { id: 'RON', value: 'RON', title: 'Romanian Leu (RON)' },
  { id: 'RSD', value: 'RSD', title: 'Serbian Dinar (RSD)' },
  { id: 'RUB', value: 'RUB', title: 'Russian Ruble (RUB)' },
  { id: 'RWF', value: 'RWF', title: 'Rwandan Franc (RWF)' },
  { id: 'SAR', value: 'SAR', title: 'Saudi Riyal (SAR)' },
  { id: 'SDG', value: 'SDG', title: 'Sudanese Pound (SDG)' },
  { id: 'SEK', value: 'SEK', title: 'Swedish Krona (SEK)' },
  { id: 'SGD', value: 'SGD', title: 'Singapore Dollar (SGD)' },
  { id: 'SOS', value: 'SOS', title: 'Somali Shilling (SOS)' },
  { id: 'SYP', value: 'SYP', title: 'Syrian Pound (SYP)' },
  { id: 'THB', value: 'THB', title: 'Thai Baht (THB)' },
  { id: 'TND', value: 'TND', title: 'Tunisian Dinar (TND)' },
  { id: 'TOP', value: 'TOP', title: 'Tongan Paʻanga (TOP)' },
  { id: 'TRY', value: 'TRY', title: 'Turkish Lira (TRY)' },
  { id: 'TTD', value: 'TTD', title: 'Trinidad and Tobago Dollar (TTD)' },
  { id: 'TWD', value: 'TWD', title: 'New Taiwan Dollar (TWD)' },
  { id: 'TZS', value: 'TZS', title: 'Tanzanian Shilling (TZS)' },
  { id: 'UAH', value: 'UAH', title: 'Ukrainian Hryvnia (UAH)' },
  { id: 'UGX', value: 'UGX', title: 'Ugandan Shilling (UGX)' },
  { id: 'UYU', value: 'UYU', title: 'Uruguayan Peso (UYU)' },
  { id: 'UZS', value: 'UZS', title: 'Uzbekistan Som (UZS)' },
  { id: 'VEF', value: 'VEF', title: 'Venezuelan Bolívar (VEF)' },
  { id: 'VND', value: 'VND', title: 'Vietnamese Dong (VND)' },
  { id: 'XAF', value: 'XAF', title: 'CFA Franc BEAC (XAF)' },
  { id: 'XOF', value: 'XOF', title: 'CFA Franc BCEAO (XOF)' },
  { id: 'YER', value: 'YER', title: 'Yemeni Rial (YER)' },
  { id: 'ZAR', value: 'ZAR', title: 'South African Rand (ZAR)' },
  { id: 'ZMK', value: 'ZMK', title: 'Zambian Kwacha (ZMK)' },
];

export const zones = [
  {
    value: 'Dateline Standard Time',
    title: '(UTC-12:00) International Date Line West',
  },
  { value: 'UTC-11', title: '(UTC-11:00) Coordinated Universal Time-11' },
  { value: 'Hawaiian Standard Time', title: '(UTC-10:00) Hawaii' },
  { value: 'Alaskan Standard Time', title: '(UTC-09:00) Alaska' },
  {
    value: 'Pacific Standard Time (Mexico)',
    title: '(UTC-08:00) Baja California',
  },
  {
    value: 'Pacific Daylight Time',
    title: '(UTC-07:00) Pacific Time (US &amp; Canada)',
  },
  {
    value: 'Pacific Standard Time',
    title: '(UTC-08:00) Pacific Time (US &amp; Canada)',
  },
  { value: 'US Mountain Standard Time', title: '(UTC-07:00) Arizona' },
  {
    value: 'Mountain Standard Time (Mexico)',
    title: '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
  },
  {
    value: 'Mountain Standard Time',
    title: '(UTC-07:00) Mountain Time (US &amp; Canada)',
  },
  {
    value: 'Central America Standard Time',
    title: '(UTC-06:00) Central America',
  },
  {
    value: 'Central Standard Time',
    title: '(UTC-06:00) Central Time (US &amp; Canada)',
  },
  {
    value: 'Central Standard Time (Mexico)',
    title: '(UTC-06:00) Guadalajara, Mexico City, Monterrey',
  },
  { value: 'Canada Central Standard Time', title: '(UTC-06:00) Saskatchewan' },
  {
    value: 'SA Pacific Standard Time',
    title: '(UTC-05:00) Bogota, Lima, Quito',
  },
  {
    value: 'Eastern Standard Time',
    title: '(UTC-05:00) Eastern Time (US &amp; Canada)',
  },
  { value: 'US Eastern Standard Time', title: '(UTC-05:00) Indiana (East)' },
  { value: 'Venezuela Standard Time', title: '(UTC-04:30) Caracas' },
  { value: 'Paraguay Standard Time', title: '(UTC-04:00) Asuncion' },
  {
    value: 'Atlantic Standard Time',
    title: '(UTC-04:00) Atlantic Time (Canada)',
  },
  { value: 'Central Brazilian Standard Time', title: '(UTC-04:00) Cuiaba' },
  {
    value: 'SA Western Standard Time',
    title: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
  },
  { value: 'Pacific SA Standard Time', title: '(UTC-04:00) Santiago' },
  { value: 'Newfoundland Standard Time', title: '(UTC-03:30) Newfoundland' },
  { value: 'E. South America Standard Time', title: '(UTC-03:00) Brasilia' },
  { value: 'Argentina Standard Time', title: '(UTC-03:00) Buenos Aires' },
  {
    value: 'SA Eastern Standard Time',
    title: '(UTC-03:00) Cayenne, Fortaleza',
  },
  { value: 'Greenland Standard Time', title: '(UTC-03:00) Greenland' },
  { value: 'Montevideo Standard Time', title: '(UTC-03:00) Montevideo' },
  { value: 'Bahia Standard Time', title: '(UTC-03:00) Salvador' },
  { value: 'UTC-02', title: '(UTC-02:00) Coordinated Universal Time-02' },
  {
    value: 'Mid-Atlantic Standard Time',
    title: '(UTC-02:00) Mid-Atlantic - Old',
  },
  { value: 'Azores Standard Time', title: '(UTC-01:00) Azores' },
  { value: 'Cape Verde Standard Time', title: '(UTC-01:00) Cape Verde Is.' },
  { value: 'Morocco Standard Time', title: '(UTC) Casablanca' },
  { value: 'UTC', title: '(UTC) Coordinated Universal Time' },
  { value: 'GMT Standard Time', title: '(UTC) Edinburgh, London' },
  { value: 'British Summer Time', title: '(UTC+01:00) Edinburgh, London' },
  { value: 'GMT Standard Time', title: '(UTC) Dublin, Lisbon' },
  { value: 'Greenwich Standard Time', title: '(UTC) Monrovia, Reykjavik' },
  {
    value: 'W. Europe Standard Time',
    title: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
  },
  {
    value: 'Central Europe Standard Time',
    title: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
  },
  {
    value: 'Romance Standard Time',
    title: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
  },
  {
    value: 'Central European Standard Time',
    title: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
  },
  {
    value: 'W. Central Africa Standard Time',
    title: '(UTC+01:00) West Central Africa',
  },
  { value: 'Namibia Standard Time', title: '(UTC+01:00) Windhoek' },
  { value: 'GTB Standard Time', title: '(UTC+02:00) Athens, Bucharest' },
  { value: 'Middle East Standard Time', title: '(UTC+02:00) Beirut' },
  { value: 'Egypt Standard Time', title: '(UTC+02:00) Cairo' },
  { value: 'Syria Standard Time', title: '(UTC+02:00) Damascus' },
  { value: 'E. Europe Standard Time', title: '(UTC+02:00) E. Europe' },
  {
    value: 'South Africa Standard Time',
    title: '(UTC+02:00) Harare, Pretoria',
  },
  {
    value: 'FLE Standard Time',
    title: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
  },
  { value: 'Turkey Standard Time', title: '(UTC+03:00) Istanbul' },
  { value: 'Israel Standard Time', title: '(UTC+02:00) Jerusalem' },
  { value: 'Libya Standard Time', title: '(UTC+02:00) Tripoli' },
  { value: 'Jordan Standard Time', title: '(UTC+03:00) Amman' },
  { value: 'Arabic Standard Time', title: '(UTC+03:00) Baghdad' },
  { value: 'Kaliningrad Standard Time', title: '(UTC+02:00) Kaliningrad' },
  { value: 'Arab Standard Time', title: '(UTC+03:00) Kuwait, Riyadh' },
  { value: 'E. Africa Standard Time', title: '(UTC+03:00) Nairobi' },
  {
    value: 'Moscow Standard Time',
    title: '(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk',
  },
  { value: 'Samara Time', title: '(UTC+04:00) Samara, Ulyanovsk, Saratov' },
  { value: 'Iran Standard Time', title: '(UTC+03:30) Tehran' },
  { value: 'Arabian Standard Time', title: '(UTC+04:00) Abu Dhabi, Muscat' },
  { value: 'Azerbaijan Standard Time', title: '(UTC+04:00) Baku' },
  { value: 'Mauritius Standard Time', title: '(UTC+04:00) Port Louis' },
  { value: 'Georgian Standard Time', title: '(UTC+04:00) Tbilisi' },
  { value: 'Caucasus Standard Time', title: '(UTC+04:00) Yerevan' },
  { value: 'Afghanistan Standard Time', title: '(UTC+04:30) Kabul' },
  { value: 'West Asia Standard Time', title: '(UTC+05:00) Ashgabat, Tashkent' },
  { value: 'Yekaterinburg Time', title: '(UTC+05:00) Yekaterinburg' },
  { value: 'Pakistan Standard Time', title: '(UTC+05:00) Islamabad, Karachi' },
  {
    value: 'India Standard Time',
    title: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
  },
  {
    value: 'Sri Lanka Standard Time',
    title: '(UTC+05:30) Sri Jayawardenepura',
  },
  { value: 'Nepal Standard Time', title: '(UTC+05:45) Kathmandu' },
  {
    value: 'Central Asia Standard Time',
    title: '(UTC+06:00) Nur-Sultan (Astana)',
  },
  { value: 'Bangladesh Standard Time', title: '(UTC+06:00) Dhaka' },
  { value: 'Myanmar Standard Time', title: '(UTC+06:30) Yangon (Rangoon)' },
  {
    value: 'SE Asia Standard Time',
    title: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
  },
  { value: 'N. Central Asia Standard Time', title: '(UTC+07:00) Novosibirsk' },
  {
    value: 'China Standard Time',
    title: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
  },
  { value: 'North Asia Standard Time', title: '(UTC+08:00) Krasnoyarsk' },
  {
    value: 'Singapore Standard Time',
    title: '(UTC+08:00) Kuala Lumpur, Singapore',
  },
  { value: 'W. Australia Standard Time', title: '(UTC+08:00) Perth' },
  { value: 'Taipei Standard Time', title: '(UTC+08:00) Taipei' },
  { value: 'Ulaanbaatar Standard Time', title: '(UTC+08:00) Ulaanbaatar' },
  { value: 'North Asia East Standard Time', title: '(UTC+08:00) Irkutsk' },
  { value: 'Japan Standard Time', title: '(UTC+09:00) Osaka, Sapporo, Tokyo' },
  { value: 'Korea Standard Time', title: '(UTC+09:00) Seoul' },
  { value: 'Cen. Australia Standard Time', title: '(UTC+09:30) Adelaide' },
  { value: 'AUS Central Standard Time', title: '(UTC+09:30) Darwin' },
  { value: 'E. Australia Standard Time', title: '(UTC+10:00) Brisbane' },
  {
    value: 'AUS Eastern Standard Time',
    title: '(UTC+10:00) Canberra, Melbourne, Sydney',
  },
  {
    value: 'West Pacific Standard Time',
    title: '(UTC+10:00) Guam, Port Moresby',
  },
  { value: 'Tasmania Standard Time', title: '(UTC+10:00) Hobart' },
  { value: 'Yakutsk Standard Time', title: '(UTC+09:00) Yakutsk' },
  {
    value: 'Central Pacific Standard Time',
    title: '(UTC+11:00) Solomon Is., New Caledonia',
  },
  { value: 'Vladivostok Standard Time', title: '(UTC+11:00) Vladivostok' },
  {
    value: 'New Zealand Standard Time',
    title: '(UTC+12:00) Auckland, Wellington',
  },
  { value: 'UTC+12', title: '(UTC+12:00) Coordinated Universal Time+12' },
  { value: 'Fiji Standard Time', title: '(UTC+12:00) Fiji' },
  { value: 'Magadan Standard Time', title: '(UTC+12:00) Magadan' },
  {
    value: 'Kamchatka Standard Time',
    title: '(UTC+12:00) Petropavlovsk-Kamchatsky - Old',
  },
  { value: 'Tonga Standard Time', title: "(UTC+13:00) Nuku'alofa" },
  { value: 'Samoa Standard Time', title: '(UTC+13:00) Samoa' },
];

export const languages = [
  { value: 'English (US)', title: 'English (US)' },
  { value: 'English (UK)', title: 'English (UK)' },
  { value: 'Deutsch', title: 'Deutsch' },
  { value: 'Dansk', title: 'Dansk' },
  { value: 'Español', title: 'Español' },
  { value: 'Nederlands', title: 'Nederlands' },
  { value: 'Italiano', title: 'Italiano' },
  { value: '中文 (繁體)', title: '中文 (繁體)' },
];

export const dropdownOptions = [
  {
    id: 'header-options',
    className: 'dropdown-header',
    title: 'Options',
  },
  {
    id: 'export-copy',
    title: 'Copy',
    className: 'dropdown-item cursor-pointer',
    img: {
      src: copy,
      alt: 'Copy',
    },
  },
  {
    id: 'export-print',
    title: 'Print',
    className: 'dropdown-item cursor-pointer',
    img: {
      src: print,
      alt: 'Print',
    },
  },
  {
    id: 'header-download options',
    className: 'dropdown-header',
    title: 'Download options',
    divider: true,
  },
  {
    id: 'export-excel',
    title: 'Excel',
    className: 'dropdown-item cursor-pointer',
    img: {
      src: excel,
      alt: 'Excel',
    },
  },
  {
    id: 'export-csv',
    title: 'Csv',
    className: 'dropdown-item cursor-pointer',
    img: {
      src: csvFormat,
      alt: 'Csv',
    },
  },
  {
    id: 'export-pdf',
    title: 'PDF',
    className: 'dropdown-item cursor-pointer',
    img: {
      src: pdf,
      alt: 'PDF',
    },
  },
];

export const paginationDefault = {
  page: 1,
};

export const initialLessonState = {
  id: '',
  title: '',
  content: '',
  categoryId: null,
  maxPoints: null,
  maxAttemps: null,
  duration: null,
  tags: [],
  documents: '',
  icon: '',
};

export const initialQuizState = {
  id: '',
  intro: '',
  description: '',
};

export const columns = [
  {
    key: 'Rank',
    title: 'Rank',
    className: 'width-2-rem',
  },
  {
    key: 'Name',
    title: 'Name',
    className: 'text-left',
  },
  {
    key: 'CompletedLessons',
    title: 'Completed lessons',
    className: '',
  },
  {
    key: 'PendingLessons',
    title: 'Pending lessons',
    className: '',
  },
  {
    key: 'PointsEarned',
    title: 'Points earned',
    className: '',
  },
];

export const initialCreateRoleState = {
  name: '',
  description: '',
};

export const createRole = {};

export const DEFAULT_PASSWORD_RULES = {
  passwordLength: false,
  lowercase: false,
  uppercase: false,
  specialCharacter: false,
  number: false,
};

export const ACTIVITY_FEED_TYPES = {
  call: 'callActivity',
  meeting: 'meetingActivity',
  task: 'taskActivity',
  deadline: 'deadlineActivity',
  email: 'emailActivity',
  lunch: 'lunchActivity',
  note: 'note',
  file: 'file',
  fileDeleted: 'fileDeleted',
  deletion: 'deletion',
  report: 'report',
  creation: 'creation',
  updated: 'updated',
  contactLinked: 'contactLinked',
  contactUnlinked: 'contactUnlinked',
  organizationLinked: 'organizationLinked',
  organizationUnlinked: 'organizationUnlinked',
  lessonCompleted: 'lessonCompleted',
  lessonStarted: 'lessonStarted',
  courseCompleted: 'courseCompleted',
  courseStarted: 'courseStarted',
  organization: 'organization',
};

export const ACTIVITY_FEED_THEMES = {
  [ACTIVITY_FEED_TYPES.organizationLinked]: {
    icon: 'corporate_fare',
    color: 'bg-soft-green',
  },
  [ACTIVITY_FEED_TYPES.organizationUnlinked]: {
    icon: 'corporate_fare',
    color: 'bg-soft-red',
  },
  [ACTIVITY_FEED_TYPES.contactLinked]: {
    color: 'bg-soft-green',
    icon: 'person_add_alt_1',
  },
  [ACTIVITY_FEED_TYPES.contactUnlinked]: {
    color: 'bg-soft-red',
    icon: 'person_remove_alt_1',
  },
  [ACTIVITY_FEED_TYPES.note]: {
    color: 'step-icon-soft-warning',
    icon: 'text_snippet',
  },
  [ACTIVITY_FEED_TYPES.call]: {
    color: 'bg-soft-green',
    icon: 'call',
  },
  [ACTIVITY_FEED_TYPES.meeting]: {
    color: 'bg-soft-cyan',
    icon: 'groups',
  },
  [ACTIVITY_FEED_TYPES.task]: {
    color: 'bg-soft-yellow',
    icon: 'schedule',
  },
  [ACTIVITY_FEED_TYPES.deadline]: {
    color: 'bg-soft-red',
    icon: 'flag',
  },
  [ACTIVITY_FEED_TYPES.email]: {
    color: 'bg-soft-purple',
    icon: 'email',
  },
  [ACTIVITY_FEED_TYPES.lunch]: {
    color: 'bg-soft-pink',
    icon: 'restaurant_menu',
  },
  [ACTIVITY_FEED_TYPES.file]: {
    color: 'step-icon-soft-info',
    icon: 'attachment',
  },
  [ACTIVITY_FEED_TYPES.fileDeleted]: {
    color: 'bg-soft-red',
    icon: 'attachment',
  },
  [ACTIVITY_FEED_TYPES.deletion]: {
    color: 'bg-soft-red',
    icon: 'delete',
  },
  [ACTIVITY_FEED_TYPES.report]: {
    color: 'bg-soft-green',
    icon: 'analytics',
  },
  [ACTIVITY_FEED_TYPES.organization]: {
    color: 'bg-soft-green',
    icon: 'analytics',
  },
  [ACTIVITY_FEED_TYPES.lessonCompleted]: {
    icon: 'class',
    color: 'bg-soft-green',
  },
  [ACTIVITY_FEED_TYPES.lessonStarted]: {
    icon: 'flag',
    color: 'bg-soft-yellow',
  },
  [ACTIVITY_FEED_TYPES.courseCompleted]: {
    icon: 'cast_for_education',
    color: 'bg-soft-green',
  },
  [ACTIVITY_FEED_TYPES.courseStarted]: {
    icon: 'flag',
    color: 'bg-soft-yellow',
  },
  // new types (create, update) activities
  creation: {
    color: 'step-icon-soft-dark',
    icon: 'fiber_new',
  },
  updated: {
    color: 'step-icon-soft-dark',
    icon: 'new_releases',
  },
};

export const NAME_UNKNOWN_USER = 'Unknown User';
export const NAME_INVITED_USER = 'Invited User';
export const SEND_EMAIL_SUCCESS = 'Email was send successfully';
export const USER_UPDATE_SUCCESS = 'The user has been updated';
export const SUSPEND_USER_MESSAGE =
  'The suspension of users is a temporary state, if you want you can activate it later';

export const badgeColorStatus = [
  {
    status: 'active',
    color: 'success',
  },
  {
    status: 'invited',
    color: 'warning',
  },
  {
    status: 'suspended',
    color: 'danger',
  },
  {
    status: 'deactivated',
    color: 'danger',
  },
];

export const LABEL_BUTTON_RESEND_INVITATION = 'Resend invitation';
export const LABEL_BUTTON_SUSPEND_USER = 'Suspend User';
export const LABEL_BUTTON_ACTIVATE_USER = 'Activate User';
export const TEXT_INFO_MODAL_SUSPEND =
  'Are you sure you want to suspend this user? If you want then you can reactivate it.';
export const TEXT_INFO_MODAL_ACTIVE =
  'Are you sure you want to reactivate this user? If you want then you can suspend it.';
export const TEXT_INFO_REMOVE_FILE =
  'Are you sure you want to remove this file?';

export const USER_SUSPENDED = 'User suspended';
export const USER_ACTIVE = 'User active';

export const STATUS_ACTIVE = 'active';
export const STATUS_INVITED = 'invited';
export const STATUS_SUSPENDED = 'deactivated';
export const ROLE_LABEL = 'Role';
export const TENANT_LABEL = 'Tenant';

export const DEALS_LABEL = 'Deals';
export const PROBABILITY = 'Probability';
export const DEALS_LABEL_BUTTON = 'Add Deal'; // Reptitive code, Add Deal already defined.

export const VALID_FILES_EXTENSIONS = `application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain, application/pdf, image/jpeg,
image/jpg, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
application/vnd.openxmlformats-officedocument.presentationml.presentation`;

export const buttons = {
  more: 'More Options',
  less: 'Less Options',
  down: 'keyboard_arrow_down',
  up: 'keyboard_arrow_up',
  location: 'Location',
  conference: 'Conference Call',
};

export const NO_REPORT_SELECTED =
  'No report selected. Please, choose a report from the left menu to get started.';

export const columnsTableGroups = [
  {
    key: 'groupName',
    orderBy: 'name',
    component: 'Group Name',
  },
  {
    key: 'parentGroup',
    orderBy: 'parent',
    component: 'Parent Group',
  },
  {
    key: 'lastModification',
    orderBy: 'updated_at',
    component: 'Last modificaction',
  },
];

export const groupAttrData = {
  id: '',
  name: '',
  parent_id: null,
};

export const DEFAULT_DOMAIN = 'identifee.com';

export const CANT_UPDATE_OVERVIEW_INFO =
  "You don't have permission to edit this info";

export const CANT_ADD_ADDITIONAL_OWNER =
  "You don't have permission to add owners";

export const CANT_REMOVE_ADDITIONAL_OWNER =
  "You don't have permission to remove owners";

export const CANT_ADDEDIT_PRODUCTS =
  "You don't have permision to add or edit a product";

export const CANT_REMOVE_PRODUCTS =
  "You don't have permission to remove a product";

export const CANT_REMOVE_DEAL = "You don't have permission to remove this Deal";

export const CANT_ADD_CONTACT =
  "You don't have permission to add/edit contacts";

export const TIMEZONE_DESCRIPTION =
  'Timezone is updated automatically to match your computer timezone';

export const BRANDING_LABEL = 'Branding';
