import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
// initialize our state and set everything to null
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    console.log(this.getDataFromDb())
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    }).then(res => console.log(res.data));
  };


  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        console.log(idTodelete);
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    const getValues = data.length ? data.map( (value, i) => {
      return(
        <li className='collection-item' key={i}>
          <i className="small material-icons">person</i>
          <span style={{ color: "gray" }}> id: {value.id}</span><br />
          <span style={{ color: "gray" }}> data: {value.message}</span>
        </li>)
    }) : (<p className='center'>No posts yet</p>);

    return (
      <div className='center container'>
        <ul className='collection'>
          <h4 className='section center darken-red'>Now I am a full stack developer</h4>
          {getValues}
        </ul>
        <div style={{ padding: "10px" }} className='card-content'>
          <input
            id="add-field"
            type="text"
            className="input-field"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Enter a message"
            style={{ width: "200px" }}
          />
          <button
            onClick={() => this.putDataToDB(this.state.message)}
            ><i className="small material-icons">add_circle</i>
          </button>
        </div>
        <div style={{ padding: "10px" }} className='card-content'>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="Enter id to Delete"
          />
          <button
            style={{ paddingLeft: "10px" }}
            onClick={() => this.deleteFromDB(this.state.idToDelete)}
            ><i className="small material-icons">delete_forever</i>
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <span>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="Id to update"
            />
        </span>
        <span> {} </span>
        <span>
          <input
            type="text"
            style={{ width: "200px" , paddingRight: "10px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="Enter value to update"
          />
      </span>
          <button
            style={{ paddingLeft: "10px" }}
            onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}
            ><i className="small material-icons">edit</i>
          </button>
        </div>
      </div>
    );
  }
}

export default App;
