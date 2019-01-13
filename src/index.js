import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/beaus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBeer, faMapPin } from '@fortawesome/free-solid-svg-icons'
import logo from './assets/images/beaus-black-logo.svg';
import GoogleMapReact from 'google-map-react';

class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <div className="contain-width"><img src={logo} className='header-logo' /></div>
      </div>
    );
  };
}

class Footer extends React.Component {
  render() {
    return (
      <div id="footer">Created by David Oglesby for HackerYou</div>
    )
  }
}

const MapPin = ({selected}) => {
  console.log(selected)
  return (
    <div className="map-pin-container">
      {selected ?
        <FontAwesomeIcon icon={faMapPin} className="map-pin map-pin-selected" /> :
        <FontAwesomeIcon icon={faMapPin} className="map-pin map-pin-not-selected" />
      }
    </div> 
  )
};

class StoreLocation extends React.Component {

  static defaultProps = {
    center: {
      lat: 43.70011,
      lng: -79.4163
    },
    zoom: 6
  }; 

  render() {    
    return (
      <div className="map">
        {/* Important! Always set the container height explicitly */}
        <div onClick={this.props.handleClickBackToDetails}>Back to All Stores</div>
        <div className="directions-container">
          <div className="map-container">
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyBCl-LjuaDvXajkufdVmEdBkH40Yglnjjo' }}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
            >
              {this.props.stores.map((store) => {
                return (
                  <MapPin
                    key={store.id}
                    lat={store.latitude}
                    lng={store.longitude}
                    text={store.name}
                  />
                )
              })}
              <MapPin
                lat={this.props.storeLatitude}
                lng={this.props.storeLongitude}
                text={this.props.storeName}
                selected
              />
            </GoogleMapReact>
          </div>
          <div className="map-stores-container">
            {this.props.stores.map((store) => {
              return (
                <div key={store.id}>{store.name}</div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

class ItemDetails extends React.Component {
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
      console.log("Error" + err)
      this.setState({
        loading: false,
        error: 'Error fetching: ' + err
      })
    }
  }

  render() {   
    return (
      <React.Fragment>
        <div><a href="#" onClick={this.props.backClick}>&#x3C; Back To All Seasonal Bears</a> | {this.props.name}</div>
        <h1>{this.props.name}</h1>
        <div className="item-details-container">
          <div><img src={this.props.image_url} className='item-details-image' /></div>
          <div className="item-details-content">
            {this.props.producer_name ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Producer:</div> 
                <div className="item-details-content-value">{this.props.producer_name}</div>
              </div> : ''
            }
            {this.props.origin ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Origin:</div> 
                <div className="item-details-content-value">{this.props.origin}</div>
              </div> : ''
            }
            {this.props.primary_category ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Category:</div> 
                <div className="item-details-content-value">{this.props.primary_category}</div>
              </div> : ''
            }
            {this.props.style ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Style:</div> 
                <div className="item-details-content-value">{this.props.style}</div>
              </div> : ''
            }
            {this.props.tasting_note ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Tasting Note:</div> 
                <div className="item-details-content-value">{this.props.tasting_note}</div>
              </div> : ''
            }
            {this.props.serving_suggestion ? 
              <div className="item-details-content-item">
                <div className="item-details-content-label">Suggestions:</div> 
                <div className="item-details-content-value">{this.props.serving_suggestion}</div>
              </div> : ''
            }
            <div href="#" class="button" onClick={this.props.backClick}>View All Seasonal Beers</div>
          </div>
        </div>
        <div className="stores-title">Where to find:</div>
        <div className='items-container'>
          {this.state.storeData.map((store) => { 
            return (
              <div className="store-container" key={store.id}>
                <div className="store-content">
                  <div className="store-name">{store.name}</div>
                  <div className="store-address">{store.address_line_1}</div>
                  { store.address_line_2 ? 
                    <div className="store-address">{ store.address_line_2 }</div> : ''}
                  <div className="store-city">{store.city}, {store.postal_code}</div>
                  <div className="store-phone">{store.telephone}</div>
                </div>
                <div className="store-directions" onClick={(e) => this.props.handleClickGoToStoreMap(this.state.storeData, store.name, store.latitude, store.longitude, e)}>Get directions</div>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
}

class ItemDetailsLink extends React.Component {
  handleClick = () => {
    //this.props.onHeaderClick(this.props.value);
    this.props.product_click(this.props.product_id);
  }

  render() {
    return (
      <React.Fragment>
        <img src={this.props.image_url} onClick={this.handleClick} />
      </React.Fragment>
      // <th onClick={this.handleClick}>
      //   {this.props.column}
      // </th>
    );
  }
}

class Beaus extends React.Component {
  state = {
    data: [],
    loading: true,
    selectedItem: {},
    view: 'home', //home, details, map
    stores: {},
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
        console.log(data)
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
  
  contentError = (err) => {
    return (
      <React.Fragment>
        {err}
      </React.Fragment>
    )
  }

  contentLoading = () => {
    return (
      <React.Fragment>
        Loading...
      </React.Fragment>
    )
  }

  contentDetails = (id, name, image_url, tasting_note, style, origin, primary_category, producer_name, serving_suggestion) => {
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

  handleClickGoToHome = () => {
    this.setState({
      view: 'home',
      selectedItem: {}
    })
  }

  handleClickBackToDetails = () => {
    this.setState({
      view: 'details',
      stores: {}
    })
  }

  handleClickGoToStoreMap = (stores, storeName, storeLatitude, storeLongitude) => {
    this.setState({
      view: 'map',
      stores: {
        stores: stores,
        selectedStoreName: storeName,
        selectedStoreLatitude: storeLatitude,
        selectedStoreLongitude: storeLongitude
      }
    })
  }

  contentData = (data) => {
    return (
      <React.Fragment>
        <h1>Beau’s Seasonal Beverages</h1>
        <div className='items-container'>
          {data.map((item, index) => { 
            return (
              <div className='item-container' key={item.id}>
                <div className='item-image-container'>
                  {item.image_thumb_url ? 
                    <img src={item.image_thumb_url} className='item-image' onClick={(e) => this.contentDetails(item.id, item.name, item.image_url, item.tasting_note, item.style, item.origin, item.primary_category, item.producer_name, item.serving_suggestion, e)} /> : 
                    <FontAwesomeIcon icon={faBeer} className="item-image-missing"  onClick={(e) => this.contentDetails(item.id, item.name, item.image_url, item.tasting_note, item.style, item.origin, item.primary_category, item.producer_name, item.serving_suggestion, e, e)} />
                  }
                </div>
                <div className="item-text">{item.name}</div>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
  
  render() {
    let content;
    if (this.state.error !== '') {
      content = this.contentError(this.state.error);
    }
    else if (this.state.loading) {
      content = this.contentLoading();
    }
    else if (this.state.view == "details") {
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
          backClick={this.handleClickGoToHome}
          handleClickGoToStoreMap={this.handleClickGoToStoreMap}
        />
    }
    else if (this.state.view == "map") {
      content = <StoreLocation 
                  stores = {this.state.stores.stores}
                  storeName = {this.state.stores.selectedStoreName}
                  storeLatitude = {this.state.stores.selectedStoreLatitude}
                  storeLongitude = {this.state.stores.selectedStoreLongitude}
                  handleClickBackToDetails={this.handleClickBackToDetails}
                />
    }
    else {
      content = this.contentData(this.state.data);
    }

    return (
      <React.Fragment>
        <Header />
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