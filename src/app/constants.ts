export const PERMISSION = {
  SUPER_USER: 'Super user',
  TL: 'TL',
  SCGL: 'SCGL',
  CGL: 'CGL',
  FL: 'FL',
  WM: 'WM',
  NOT_VERIFIED: 'Not verified',
};

const PERMISSION_TYPE = {
  check: [PERMISSION.SUPER_USER, PERMISSION.TL, PERMISSION.SCGL],
};

export const CHECK_PERMISSION = {
  canCheckAtt: (user: any) => {
    if (user) {
      if (user.permission) {
        if (PERMISSION_TYPE.check.includes(user.permission)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
};

export const ClickAction = {
  STATISTICS: 1,
  VIEW_FOLLOW_UP: 2,
  PAST_STATUS_SUBMISSION: 3,
  LOGIN: 4,
  CLICK_NAME: 5,
  MONTHLY_REPORT: 6,

  // Login
  LOGIN_EMAIL: 7,
  LOGIN_PHONE: 8,
  REQUEST_OTP: 9,

  // Buttons in view follow up page
  V_SORT_BY_TIMESTAMP: 10,
  V_SORT_BY_DATE: 11,
  V_FILTER: 12,
  V_SEARCH: 13,
  V_CLICK_NAME: 14,

  // buttons in past status submission page
  P_SORT_BY_TIMESTAMP: 15,
  P_SORT_BY_DATE: 16,
  P_FILTER: 17,
  P_CLICK_NAME: 18,
};
