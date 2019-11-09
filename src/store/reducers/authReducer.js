import {
  SET_USER_CREDS,
  LOG_OUT,
  SET_MODAL_VISIBLE,
  SET_VIDEO_AGREE_VISIBLE,
  SET_VIDEO_PLAYER_VISIBLE,
  SET_LOGGED_IN_TRUE
} from './../actions/actionTypes';
import * as SecureStore from 'expo-secure-store';
import {clearUserCases} from './userCasesReducer';

const initialState = {
  user: null,
  error: null,
  isLoggedIn: false,
  loadingUser: false,
  accessToken: null,
  expiresIn: null,
  idToken: {},
  modalVisible: false,
  videoAgree: false,
  videoVisible: false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_CREDS:
      return {
        ...state,
        user: action.decodedToken,
        isLoggedIn: true,
        accessToken: action.auth0Data.access_token,
        idToken: action.auth0Data.id_token,
        expiresIn: action.auth0Data.expires_in,
        error: null,
        loadingUser: false
      };
    case SET_LOGGED_IN_TRUE: 
      return {
        ...state,
        isLoggedIn: true,
        idToken: action.payload
      }
    case SET_MODAL_VISIBLE:
      return {
        ...state,
        modalVisible: action.payload,
        videoAgree: false,
        videoVisible: false
      };
    case SET_VIDEO_AGREE_VISIBLE:
      return {
        ...state,
        videoAgree: true
      };
    case SET_VIDEO_PLAYER_VISIBLE:
      return {
        ...state,
        videoAgree: false,
        videoVisible: true
      };
    case LOG_OUT:
      SecureStore.deleteItemAsync('cok_access_token');
      SecureStore.deleteItemAsync('cok_id_token');
      return initialState;
    default:
      return state;
  }
};
