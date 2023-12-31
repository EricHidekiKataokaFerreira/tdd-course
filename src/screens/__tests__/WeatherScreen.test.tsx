import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import WeatherScreen from "../WeatherScreen"
import { useNavigation } from "@react-navigation/native"
import { MockProvider, mockStore } from "../../utils/test.utils"
import { fetchWeather, fetchWeatherFailure, fetchWeatherSuccess } from "../../store/weather/actions"
import { Provider } from "react-redux"
import { nullWeather } from "../../types/Weather"

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual<object>('@react-navigation/native'),
    useNavigation: jest.fn().mockReturnValue({goBack: jest.fn()}),
    useRoute: jest.fn().mockReturnValue({ params: {longitude: 0, latitude: 0}})
  }
})

describe('Weather Screen', () => {
  test('Should render correclty 2', () => {
    const wrapper = render(
      <MockProvider>
        <WeatherScreen/>
      </MockProvider>
    )
    wrapper.getByTestId('weather-escreen')
  })

  test('Should return to home when button home is pressed', () => {
    const mockGoBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValueOnce({goBack: mockGoBack})
    const wrapper = render(
      <MockProvider>
        <WeatherScreen/>
      </MockProvider>
    )
    const button = wrapper.getByText('Home')

    fireEvent.press(button)
    expect(mockGoBack).toHaveBeenCalled
  })

  test('Should fetch weather', async () => {
    const interceptor = jest.fn()
    const store = mockStore(interceptor)
    render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    await waitFor(() => {
      expect(interceptor).toHaveBeenCalledWith(fetchWeather(0, 0))
    })
  })

  test('Should display loader when fetching weather', async () => {
    const interceptor = jest.fn()
    const store = mockStore(interceptor)
    render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    await waitFor(() => {
      expect(interceptor).toHaveBeenCalledWith(fetchWeather(0, 0))
    })
  })

  test('Should display loader when fetching weather', () => {
    const wrapper = render(
      <MockProvider>
        <WeatherScreen/>
      </MockProvider>
    )
    wrapper.getByTestId('weather-screen-loader')
  })

  test('Should display given error', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherFailure('mock-error'))
    })

    wrapper.getByText('mock-error')
  })

  test('Should display image given weather icon', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, icon: 'mock-icon'}))
    })

    const image = wrapper.getByTestId('weather-screen-icon')
    expect(image).toHaveProp('source', {uri: 'mock-icon'})
  })

  test('Should not display icon when weather has no icon', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather}))
    })

    expect(() => wrapper.getByTestId('weather-screen-icon')).toBeNull
  })

  test('Should display description from given weather', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, description: 'mock-description'}))
    })

    wrapper.getByText('mock-description')
  })

  test('Should not display description when weather has no icon', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess(nullWeather))
    })

    expect(() => wrapper.getByTestId('weather-screen-description')).toThrow()
  })

  test('Should display city name from given weather', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, city: 'mock-city'}))
    })

    wrapper.getByText('mock-city')
  })

  test('Should not display city when weather has no icon', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess(nullWeather))
    })

    expect(() => wrapper.getByTestId('weather-screen-city')).toThrow()
  })

  test('Should display temperature name from given weather', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, temperature: 11}))
    })

    const container = wrapper.getByTestId('weather-screen-temperature')
    const title = wrapper.getByText('temperature')
    const temperature = wrapper.getByText('11°C')

    expect(container).toContainElement(title)
    expect(container).toContainElement(temperature)
  })

  test('Should display formated wind', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, windspeed: 1}))
    })

    const container = wrapper.getByTestId('weather-screen-wind')
    const title = wrapper.getByText('wind')
    const wind = wrapper.getByText('1m/s')

    expect(container).toContainElement(title)
    expect(container).toContainElement(wind)
  })

  test('Should display formated himidity', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, humidity: 15}))
    })

    const container = wrapper.getByTestId('weather-screen-humidity')
    const title = wrapper.getByText('humidity')
    const humidity = wrapper.getByText('15%')

    expect(container).toContainElement(title)
    expect(container).toContainElement(humidity)
  })


  test('Should display formated pressure', () => {
    const store = mockStore()
    const wrapper = render(
      <Provider store={store}>
        <WeatherScreen/>
      </Provider>
    )

    act(() => {
      store.dispatch(fetchWeatherSuccess({...nullWeather, pressure: 1000}))
    })

    const container = wrapper.getByTestId('weather-screen-pressure')
    const title = wrapper.getByText('pressure')
    const pressure = wrapper.getByText('1000 hPa')

    expect(container).toContainElement(title)
    expect(container).toContainElement(pressure)
  })
})