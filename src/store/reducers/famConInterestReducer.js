import {
  TRACK_EMAIL,
  TRACK_EMAIL_FAILURE,
  TRACK_EMAIL_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  error: null,
  email: null
};

export const famConInterestReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRACK_EMAIL:
      return {
        ...state,
        error: null,
        isLoading: true,
        email: null
      };
    case TRACK_EMAIL_SUCCESS:
      console.log();
      return {
        ...state,
        isLoading: false,
        error: null,
        email: action.payload.emailAddress,
        message: `${action.payload.emailAddress} has been added to our list.`
      };
    case TRACK_EMAIL_FAILURE:
      return {
        ...state,
        error: {
          message: `${action.email} is on our list already.`,
          error: action.payload
        },
        isLoading: false,
        email: null
      };
    default:
      return state;
  }
};
