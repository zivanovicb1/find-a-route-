import React, { Component } from "react";
import styled from "styled-components";
import LocationPickers from "./LocationPickers";
import theme from "../../../theme";
import Routes from "./Routes";
import "./transitions.css";
import Headline from "../../../components/Headline";
import { Motion, spring, presets } from "react-motion";
import axios from "axios";
import PropTypes from "prop-types";

const Wrapper = styled.div`margin-top: 50px;`;
const Container = styled.div`
  @media screen and (max-width: 960px) {
    padding: 0 15px;
  }
  @media screen and (min-width: 960px) {
    width: 960px;
    margin: 0 auto;
    font-size: 1rem;
  }
`;

export default class App extends Component {
  state = {
    routes: JSON.parse(localStorage.getItem("routes")) || [],
    geolocationSupport: true,
    // has lat and lng
    userLocation: null,
    // street address,
    userAddress: null
  };
  addRoute = newRoute => {
    this.setState(
      (prevState, props) => {
        return {
          routes: [...prevState.routes, newRoute]
        };
      },
      // cb to call after local state is changed
      // so we are immediately updating localStorage
      () => {
        localStorage.setItem("routes", JSON.stringify(this.state.routes));
      }
    );
  };

  deleteRoute = id => {
    const { routes } = this.state;

    let copyArr = routes;
    let index = routes.findIndex(o => {
      return o.id === id;
    });

    // if we find the obj in state, as we should
    // and we can instantly change localStorage
    if (index !== -1) {
      copyArr.splice(index, 1);
      this.setState({ routes: copyArr }, () => {
        localStorage.setItem("routes", JSON.stringify(copyArr));
      });
    }
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.setState({ userLocation: pos });
        // call to get user address
        axios
          .request({
            method: "GET",
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=AIzaSyBvObJn4ahKBqeSUZMb33g_EBtpuEHwklc`
          })
          .then(response => {
            let addr = response.data.results[0].formatted_address;
            if (addr) this.setState({ userAddress: addr });
          })
          .catch(e => {
            console.log(e);
          });
      });
    } else {
      this.setState({ geolocationSupport: false });
    }
  }

  render() {
    const { routes, userAddress, userLocation } = this.state;
    return (
      <Wrapper>
        <Container>
          <div>
            <LocationPickers
              userAddress={userAddress}
              userLocation={userLocation}
              addRoute={this.addRoute}
              getScrollNode={this.props.getScrollNode}
            />
            <Motion
              defaultStyle={{ x: -350, o: 0 }}
              style={{
                x: spring(routes.length === 0 ? 0 : -350, presets.wobbly),
                o: spring(routes.length === 0 ? 1 : 0)
              }}
            >
              {style => (
                <Headline
                  style={{
                    opacity: style.o,
                    transform: `translateX(${style.x}px)`,
                    display: routes.length === 0 ? "block" : "none"
                  }}
                  color={theme.darkViolet}
                  key="1"
                >
                  No routes yet
                </Headline>
              )}
            </Motion>

            <Motion
              defaultStyle={{ x: 350, o: 0 }}
              style={{
                x: spring(routes.length !== 0 ? 0 : 350, presets.wobbly),
                o: spring(routes.length !== 0 ? 1 : 0)
              }}
            >
              {style => (
                <Headline
                  className="routes-headline"
                  style={{
                    opacity: style.o,
                    transform: `translateX(${style.x}px)`,
                    display: routes.length !== 0 ? "block" : "none"
                  }}
                  color={theme.darkViolet}
                  key="1"
                >
                  You asked for
                </Headline>
              )}
            </Motion>
            <Routes deleteRoute={this.deleteRoute} routes={routes} />
          </div>
        </Container>
      </Wrapper>
    );
  }
}

App.propTypes = {
  getScrollNode: PropTypes.func.isRequired
};
