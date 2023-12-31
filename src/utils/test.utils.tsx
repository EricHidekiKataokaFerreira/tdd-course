import { Middleware, applyMiddleware, createStore } from 'redux'
import rootReducer, { StateType } from '../store/reducers'
import { ElementType, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { RenderOptions, render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import React from 'react'
import { runSaga } from 'redux-saga'

type Action = {
  type?: any
  payload?: any
}

const store = createStore(rootReducer)

export function mockStore(interceptor?: jest.Mock) {
  const logger: Middleware<{}, StateType> = () => next => action => {
    interceptor?.(action)
    return next(action)
  }

  return createStore(rootReducer, undefined, applyMiddleware(logger))
}

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
const mockedStore = mockStore()

export function MockProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  return <Provider store={mockedStore}>{children}</Provider>
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