import { createStore } from 'redux'
import rootReducer from '../store/reducers'
import { ElementType, ReactElement, ReactNode } from 'react'
import { RenderOptions, render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import React from 'react'
import { runSaga } from 'redux-saga'

type Action = {
  type?: any
  payload?: any
}

const store = createStore(rootReducer)

export async function recordSaga(worker: any, initialAction: Action) {
  const dispatched: Array<Function> = []

  await runSaga({
    dispatch: (action: Function) => dispatched.push(action)
  },
    worker, 
    initialAction
  ).toPromise()

  return dispatched
}

type CustomRenderOptions = {
  store?: typeof store
}

const AlltheProviders = (options: CustomRenderOptions) => ({
    children,
  } : {
    children: ReactNode
  }) => {
  return <Provider store={options.store || store}>{children}</Provider> 
}

const customRender = (ui: ReactElement, options: CustomRenderOptions & Omit<RenderOptions, 'queries'> = {}, ) => {
  const { store, ...others} = options
  return render(ui, {
    wrapper: AlltheProviders({store}) as React.ComponentType,
    ...others,
  })

}

export * from '@testing-library/react-native'
export {customRender as render}