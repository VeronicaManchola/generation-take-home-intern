import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import './YourComponent.css'
import firebase from './Firebase';

/*
* Use this component as a launching-pad to build your functionality.
*
*/

const mapStyles = {
  width: '40rem',
  height: '40rem'
};

class YourComponent extends Component {

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.ref = firebase.firestore().collection('favorites').doc("list");
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      data: null,
      favorites: []
    }
  }

  favoriteButton() {
    const btn = <input value="Favorito" type="button" onClick={() => {
      let newFav = this.state.selectedPlace
      let favList = this.state.favorites.concat(newFav);
      this.ref.set({ favList });
      this.setState({ favorites: favList })
    }} />

    window.requestAnimationFrame(function () {
      let space = document.getElementById("btnSpace");
      if (space !== null) {
        ReactDOM.render(btn, space)
      }
    });
  }

  componentDidMount() {
    fetch('./store_directory.json')
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(console.error);
  }

  componentDidUpdate() {
    console.log(this.state.favorites);
    this.favoriteButton();
  }

  onMarkerClick = (props, marker, e) => {

    this.setState({
      selectedPlace: props,
      activeMarker: e,
      showingInfoWindow: true
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    if (!this.state.data) {
      return <div />
    }

    return (
      <div>
        <h1 style={divStyle}> Put your solution here!</h1>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div id="map">
                <Map
                  google={this.props.google}
                  zoom={12}
                  style={mapStyles}
                  initialCenter={{
                    lat: 19.4285,
                    lng: -99.1277
                  }}
                  onClick={this.onMapClicked}>
                  {this.state.data.map((store, index) => {
                    return (
                      <Marker
                        position={{ lat: store.Coordinates.lat, lng: store.Coordinates.lng }}
                        onClick={this.onMarkerClick.bind(this, store)}
                        name={store.name}
                        address={store.address} />
                    )
                  }
                  )}
                  <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                  >
                    <div>
                      <h5>{this.state.selectedPlace.Name}</h5>
                      <p>{this.state.selectedPlace.Address}</p>
                      <div id="btnSpace"></div>
                    </div>
                  </InfoWindow>
                </Map>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var divStyle = {
  border: 'red',
  borderWidth: 2,
  borderStyle: 'solid',
  padding: 20
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A'
})(YourComponent);
