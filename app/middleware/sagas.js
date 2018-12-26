import { all, call, takeEvery, throttle, fork, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as actions from '../actions';

export function* sagas() {
  yield all([]);
}
