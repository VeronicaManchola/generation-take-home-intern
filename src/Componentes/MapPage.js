import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import './MapPage.css'
import firebase from '../Firebase';

/*
* Use this component as a launching-pad to build your functionality.
*
*/

class FullMap extends Component {

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

    this.ref.get().then((doc) => {
        if (doc.exists) {
          this.setState({
            favorites: doc.data().favList
          });
        } else {
          console.log("No such document!");
        }
    })
  }

  componentDidUpdate() {
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
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 stores">
                <Map
                  google={this.props.google}
                  zoom={12}
                  className="googleMap"
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
            <div className="col-12 col-md-6 stores">
              <table>
                <tbody>
                  {this.state.favorites.map((favorite, index) =>
                    <tr id={"favList-" + index} className="favList">
                      <td>{favorite.Name}</td>
                      <td>{favorite.Address}</td>
                      <td><i className="material-icons"
                      onClick={() => {
                        let toRemove = this.state.favorites
                        toRemove.splice(index, 1);
                        this.setState({ favorites: toRemove });
                        this.ref.set({ favList: toRemove })
                      }}>delete</i></td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A'
})(FullMap);
