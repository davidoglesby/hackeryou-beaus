/*
  3rd Party Librairies:
  - Google Maps: https://github.com/google-map-react/google-map-react
  - Font Awesome: https://github.com/FortAwesome/react-fontawesome
*/
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/beaus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import logo from './assets/images/beaus-black-logo.svg';
import noImagePlaceholder from './assets/images/no-beer-image-placeholder.jpg'
import GoogleMapReact from 'google-map-react';

class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <div className="contain-width" onClick={this.props.handleClickBackToHome}><img src={logo} alt="Beau's" className="header-logo" /></div>
      </div>
    );
  };
}

class Footer extends React.Component {
  render() {
    return (
      <div id="footer">Created by<br />David Oglesby<br />for hackerYou</div>
    )
  }
}

class StoreLocation extends React.Component {

  static defaultProps = {
    center: {
      lat: 43.70011,
      lng: -79.4163
    },
    zoom: 5
  }; 

  renderMarkers(map, maps) {
    let marker = new maps.Marker({
      position: {
        lat: this.props.storeLatitude,
        lng: this.props.storeLongitude
      },
      map,
      title: ''
    });
  }

  render() { 
    console.log("StoresLoad");  
    return (
      <div className="map">
        <div>&#x3C; <span class="link" onClick={this.props.handleClickBackToDetails}>Back to all Stores</span> | {this.props.storeName}</div>
        <h1>{this.props.storeName}</h1>
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBCl-LjuaDvXajkufdVmEdBkH40Yglnjjo' }}
            defaultCenter={this.props.center}
            center={this.centerMap}
            defaultZoom={this.props.zoom}
            onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
            yesIWantToUseGoogleMapApiInternals
          />
        </div>
      </div>
    )
  }
}

class Stores extends React.Component {
  state = {
    loading: true,
    storeData: [],
    error: ''
  };

  componentDidMount = () => {
    try {
      fetch("https://lcboapi.com/stores?product_id=" + this.props.id + "&access_key=MDo0ZjgzNGIxOC0wYjE1LTExZTktYTBhMy1lM2Q4MTU1YjUwZDM6Mmx6U3BXWWdMYXcyMlh6cVQ2ZE1CWmt3UWFuSjhFUVNSV0Yw")
      .then(response => {
        if (response.ok) {          
          return response.json();
        }
        else {
          throw Error (response.statusText);
        }
      })
      .then(data => {
        this.setState({
          storeData: data.result,
          loading: false,
          error: ''
        })
      })
      .catch(e => {
        this.setState({
        error: e,
        loading: false
        })
      })
    }
    catch(err) {
      this.setState({
        loading: false,
        error: 'Error fetching: ' + err
      })
    }
  }

  render() {
    let content = '';
    if (this.state.error !== '') {
      content = <div className="stores-error">We apologize, but an error has occurred loading the stores. Please try again in a few minutes.</div>
    }
    else if (this.state.loading) {
      content = <div className="stores-loading">Loading Stores...</div>
    }
    else {
      content = <div className="stores-grid">
                  {this.state.storeData.map((store) => { 
                    return (
                      <div className="store" key={store.id}>
                        <div className="store__content">
                          <div className="store__name">{store.name}</div>
                          <div className="store__contact">{store.address_line_1}</div>
                          { store.address_line_2 ? 
                            <div className="store__contact">{ store.address_line_2 }</div> : ''}
                          <div className="store__contact">{store.city}, {store.postal_code}</div>
                          <div className="store__contact">{store.telephone}</div>
                        </div>
                        <div className="store__directions" onClick={(e) => this.props.handleClickGoToStoreMap(store.name, store.latitude, store.longitude, e)}><FontAwesomeIcon icon={faMapMarkerAlt} className="store-directions__icon" />&nbsp;&nbsp;View map</div>
                      </div>
                    )
                  })}
                </div>
    }

    return (
      <React.Fragment>
        <div className="stores-title"><FontAwesomeIcon icon={faSearchLocation} className="stores-title__icon" /> Where to find:</div>
        {content}
      </React.Fragment>
    )
  }
}

class ItemDetails extends React.Component {
  

  render() { 
    console.log("ItemDetailsLoad");  
    return (
      <React.Fragment>
        <div>&#x3C; <span class="link" onClick={this.props.handleClickBackToHome}>Back to all Seasonal Beers</span> | {this.props.name}</div>
        <h1>{this.props.name}</h1>
        <div className="item-details">
          <div className="item-details__image-container">
            {this.props.image_url ? 
              <img src={this.props.image_url} alt={this.props.name} className='item-details__image' /> : 
              <img src={noImagePlaceholder} alt={this.props.name} className='item-details__image' /> 
            }
          </div>
          <div className="item-details__content">
            <div className="item_details__content-descriptions">
              {this.props.producer_name ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Producer:</div> 
                  <div className="item_details__content-value">{this.props.producer_name}</div>
                </div> : ''
              }
              {this.props.origin ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Origin:</div> 
                  <div className="item_details__content-value">{this.props.origin}</div>
                </div> : ''
              }
              {this.props.primary_category ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Category:</div> 
                  <div className="item_details__content-value">{this.props.primary_category}</div>
                </div> : ''
              }
              {this.props.style ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Style:</div> 
                  <div className="item_details__content-value">{this.props.style}</div>
                </div> : ''
              }
              {this.props.tasting_note ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Tasting Note:</div> 
                  <div className="item_details__content-value">{this.props.tasting_note}</div>
                </div> : ''
              }
              {this.props.serving_suggestion ? 
                <div className="item_details__content-item">
                  <div className="item_details__content-label">Suggestions:</div> 
                  <div className="item_details__content-value">{this.props.serving_suggestion}</div>
                </div> : ''
              }
            </div>
            <div className="item_details__exit">
              <div href="#" className="item_details__exit-button" onClick={this.props.handleClickBackToHome}>View all Seasonal Beers</div>
            </div>
          </div>
        </div>
        <Stores 
            id = {this.props.id}
            handleClickGoToStoreMap = {this.props.handleClickGoToStoreMap}
        />
      </React.Fragment>
    )
  }
}

class SeasonalItems extends React.Component {
  /*
    Display a list of seasonal items in a grid that can be clicked for further detail
  */
  render() {
    console.log("SeasonalItemsLoad");
    return (
      <React.Fragment>
        <h1>Beau’s Seasonal Beverages</h1>
        <div className="items-grid">
          {this.props.data.map((item) => { 
            return (
              <div className="items-grid__item" key={item.id}>
                <div className="items-grid__item-image-container">
                  {item.image_thumb_url ? 
                    <img src={item.image_thumb_url} alt={item.name} className='item-grid__item-image' onClick={(e) => this.props.handleClickGoToDetails(item.id, item.name, item.image_url, item.tasting_note, item.style, item.origin, item.primary_category, item.producer_name, item.serving_suggestion, e)} /> : 
                    <img src={noImagePlaceholder} alt={item.name} className='item-grid__item-image' onClick={(e) => this.props.handleClickGoToDetails(item.id, item.name, item.image_url, item.tasting_note, item.style, item.origin, item.primary_category, item.producer_name, item.serving_suggestion, e)} /> 
                  }
                </div>
                <div className="item-grid__label" onClick={(e) => this.props.handleClickGoToDetails(item.id, item.name, item.image_url, item.tasting_note, item.style, item.origin, item.primary_category, item.producer_name, item.serving_suggestion, e)}>{item.name}</div>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
}

const SeasonalItemsError = (err) => {
  return (
    <React.Fragment>
      <h1>Beau’s Seasonal Beverages</h1>
      <div className="items-error">
        We apologize, but an error has occurred loading this page. Please try again in a few minutes.
      </div>
    </React.Fragment>
  )
}

const SeasonalItemsLoading = () => {
  return (
    <React.Fragment>
      <h1>Beau’s Seasonal Beverages</h1>
      <div className="items-loading">
        Loading...
      </div>
    </React.Fragment>
  )
}

class Beaus extends React.Component {
  state = {
    data: [],
    selectedItem: {},
    store: {},
    view: 'home', //home, details, map   
    loading: true,
    error: ''
  }
  
  componentDidMount = () => {
    try {
      fetch("https://lcboapi.com/products?where=is_seasonal&where_not=is_dead&q=Beaus&per_page=100&access_key=MDo0ZjgzNGIxOC0wYjE1LTExZTktYTBhMy1lM2Q4MTU1YjUwZDM6Mmx6U3BXWWdMYXcyMlh6cVQ2ZE1CWmt3UWFuSjhFUVNSV0Yw")
      .then(response => {
        if (response.ok) {          
          return response.json();
        }
        else {
          throw Error (response.statusText);
        }
      })
      .then(data => {
        this.setState({
          data: data.result,
          loading: false,
          error: ''
        })
      })
      .catch(e => {
        this.setState({
        error: e,
        loading: false
      })
    })
    }
    catch(err) {
      this.setState({
        loading: false,
        error: 'Error fetching: ' + err
      })
    }
  }

  handleClickGoToDetails = (id, name, image_url, tasting_note, style, origin, primary_category, producer_name, serving_suggestion) => {
    this.setState({
      view: 'details',
      selectedItem: {
        id: id, 
        name: name,
        image_url: image_url, 
        tasting_note: tasting_note,
        style: style,
        origin: origin,
        primary_category: primary_category,
        producer_name: producer_name,
        serving_suggestion: serving_suggestion
      }
    })
  }

  handleClickBackToHome = () => {
    this.setState({
      view: 'home',
      selectedItem: {}
    })
  }

  handleClickBackToDetails = () => {
    this.setState({
      view: 'details',
      store: {}
    })
  }

  handleClickGoToStoreMap = (storeName, storeLatitude, storeLongitude) => {
    this.setState({
      view: 'map',
      store: {
        selectedStoreName: storeName,
        selectedStoreLatitude: storeLatitude,
        selectedStoreLongitude: storeLongitude
      }
    })
  }
  
  render() {
    let content;
    if (this.state.error !== '') {
      content = SeasonalItemsError(this.state.error);
    }
    else if (this.state.loading) {
      content = SeasonalItemsLoading();
    }
    else if (this.state.view === "details") {
      content = 
        <ItemDetails 
          id = {this.state.selectedItem.id}
          name = {this.state.selectedItem.name}
          image_url = {this.state.selectedItem.image_url}
          tasting_note = {this.state.selectedItem.tasting_note}
          style = {this.state.selectedItem.style}
          origin = {this.state.selectedItem.origin}
          primary_category = {this.state.selectedItem.primary_category}
          producer_name = {this.state.selectedItem.producer_name}
          serving_suggestion = {this.state.selectedItem.serving_suggestion}
          handleClickBackToHome={this.handleClickBackToHome}
          handleClickGoToStoreMap={this.handleClickGoToStoreMap}
        />
    }
    else if (this.state.view === "map") {
      content = <StoreLocation 
                  storeName = {this.state.store.selectedStoreName}
                  storeLatitude = {this.state.store.selectedStoreLatitude}
                  storeLongitude = {this.state.store.selectedStoreLongitude}
                  handleClickBackToDetails={this.handleClickBackToDetails}
                />
    }
    else {
      content = <SeasonalItems 
                  data = {this.state.data} 
                  handleClickGoToDetails = {this.handleClickGoToDetails}
                />
    }

    return (
      <React.Fragment>
        <Header handleClickBackToHome={this.handleClickBackToHome} />
        <div id="main" className="contain-width">
          {content}
        </div>
        <Footer />
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <Beaus />,
  document.getElementById("root")
)