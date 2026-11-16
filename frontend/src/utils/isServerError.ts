import axios from 'axios';

export const isServerError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  !axios.isCancel(error) &&
  (!error.response || error.response.status >= 500);
