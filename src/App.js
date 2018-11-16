import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from  './components/Navigation/Navigation';
import Logo from  './components/Logo/Logo';
import Rank from  './components/Rank/Rank';
import ImageLinkForm from  './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
//import signin from  './components/signin/signin';
//import Regiter from  './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
 apiKey: '201da06680d44dcf83eb4ee3610e7686'
});

const particlesOptions ={
  particles: {
    number:{
      value: 150,
      density:{
        enable: true,
        value_area:800
      }
    }
  } ,
  line_linked: {
    color: '#FFF',
    shadow: {
      enable: false
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "bubble"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "opacity": 0.1,
        "duration":2
      }
    }
  },
  "retina_detect": true
}

class App extends Component {
  constructor(){
    super();
    this.state ={
      input: '',
      imageUrl: '',
      box: {},
  //    route: 'signin' ,
    }
  }
  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow: height-(clarifaiFace.bottom_row * height)
    }

  }
  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box : box})
  }
  onInputChange =(event)=>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)) )
    .catch(err=> console.log(err));
  }
  onRouteChange =(route)=>{
    this.setState(route: route)
  }
  render() {
    return (
      <div className="App">
      <Particles 
      className='particles'
      params={particlesOptions} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        <div> 
                <Logo />
                <Rank />
                <ImageLinkForm 
                //onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
      </div>
    );
  }
}

export default App;

//console.log(response.outputs[0].data.regions[0].region_info.building_box);