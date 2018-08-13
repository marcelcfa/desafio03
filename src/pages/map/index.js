import React, { Component } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import Sidebar from '../../components/sidebar';
import Modal from '../../components/modal';
import api from '../../services/api';
import 'mapbox-gl/dist/mapbox-gl.css';

export default class Map extends Component {
  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: -23.5439948,
      longitude: -46.6065452,
      zoom: 14,
    },
    showModal: false,
    inputUser: '',
    loading: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  };

  // ja está pegando a coordenadas dos clicks
  handleMapClick = (e) => {
    const [latitude, longitude] = e.lngLat;

    alert(`Latitude: ${latitude} \nLongitude: ${longitude}`);
    this.setState({
      showModal: true,
    });
  };

  handleCloseModal = (e) => {
    this.setState({ showModal: false });
  };

  handleAddUser = async (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
      showModal: false,
    });

    try {
      const response = await api.get(`/users/${this.state.inputUser}`);
      this.setState({
        users: [...this.state.users, response.data],
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        inputUser: '',
        loading: false,
      });
    }
  };

  handleInputUser = (e) => {
    this.setState({ inputUser: e.target.value });
  };

  render() {
    return (
      <MapGL
        {...this.state.viewport}
        onClick={this.handleMapClick}
        mapStyle="mapbox://styles/mapbox/basic-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZGllZ28zZyIsImEiOiJjamh0aHc4em0wZHdvM2tyc3hqbzNvanhrIn0.3HWnXHy_RCi35opzKo8sHQ"
        onViewportChange={viewport => this.setState({ viewport })}
      >
        <Marker
          latitude={-23.5439948}
          longitude={-46.6065452}
          onClick={this.handleMapClick}
          captureClick
        >
          <img
            style={{
              borderRadius: 100,
              width: 48,
              height: 48,
            }}
            src="https://avatars2.githubusercontent.com/u/2254731?v=4"
            alt=""
          />
        </Marker>
        <Modal
          showModal={this.state.showModal}
          handleMapClick={this.handleMapClick}
          handleCloseModal={this.handleCloseModal}
          handleInputUser={this.handleInputUser}
          handleAddUser={this.handleAddUser}
        />
        <Sidebar
          users={this.state.users}
          userInput={this.state.userInput}
          handleChangeInput={this.handleChangeInput}
          handleAddUser={this.handleAddUser}
        />
      </MapGL>
    );
  }
}
