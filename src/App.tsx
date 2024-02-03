import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  fetchingData: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      fetchingData: true,
    };
  }

  stopDataStreaming() {
      // Set the component state to stop fetching data
      this.setState({ fetchingData: false });
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
        return (<Graph data={this.state.data}/>)
    }
  }
  /**
   * Get new data from server and update the state with the new data
   */
   getDataFromServer() {
       // Boolean to control fetchData
       this.setState({ fetchingData: true })
       // Function to fetch data from server
       const fetchData = () => {
           if (!this.state.fetchingData) {
                return; // Stop fetching data if fetchingData is False
           }
           DataStreamer.getData((serverResponds: ServerRespond[]) => {
               // Update the state by creating a new array of data that consists of
               // Previous data in the state and the new data from server
               this.setState({
                    data: serverResponds,
                    showGraph: true
               });
               // Call fetchData again after 100ms
               setTimeout(fetchData, 100);
           });
       };

       // Call fetchData for the first time
       fetchData();
   }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
            <button className="btn btn-danger Stop-button"
            // Added an extra button to stop the stream instead of closing the browser window
            onClick={() => {this.stopDataStreaming()}}>
            Stop Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
