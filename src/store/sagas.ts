import React from 'react'
import {fork, all, spawn} from 'redux-saga/effects'
import {saga as weather} from './weather'

export default function* () {
  yield fork(bootstrap);
}

function* bootstrap () {
  try {
    yield all(([spawn(weather)]));
  } catch (e){
    //error handling
  }
}