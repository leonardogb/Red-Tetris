export const SET_DELAY = 'SET_DELAY';

export const setDelay = (delay) => {
  return {
    type: SET_DELAY,
    payload: {
      delay: delay
    }
  }
};
