import React from "react";
import {
  Button,
  Input,
  Select,
  InputLabel,
  MenuItem,
  TextareaAutosize
} from "@material-ui/core";
import axios from "axios";
import "./styles.css";
import logo from "./images/CrimeAnonFull.png";

export default class Report extends React.Component {
  state = {
    incident: "",
    categories: ["none"],
    zip: "",
    image: [],
    reportReady: false
  };

  handleChangeCategories = e => {
    this.setState({ categories: e.target.value });
  };

  handleZip = e => {
    this.setState({ zip: e.target.value });
  };

  handleChangeIncident = e => {
    console.log(this.state.incident);

    this.setState({ incident: e.target.value });
  };

  handleImage = e => {
      let input = e.target

      for(let i = 0; i< input.files.length; i++){
        let reader = new FileReader()
        reader.onload = (b) => this.setState({image: this.state.image.concat(b.target.result)})
        reader.readAsDataURL(input.files[i])
      }
      
    }

  handleReport = async event => {
    event.preventDefault();
    axios
      .get("http://localhost:2500/crimes", {
        incident: this.state.incident,
        categories: this.state.categories,
        zip: this.state.zip
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <form id="input-form">
        <h1>{console.log(this.state.image)}</h1>
        <img src={logo} alt="Crime Anon logo"></img>
        <InputLabel htmlFor="incident-input">
          Tell us about your incident (required):
        </InputLabel>
        <input
          id="zip-input"
          style={{ width: "350px" }}
          onChange={this.handleZip}
          placeholder="Enter the ZIP code of your incident here (required)"
        ></input>
        <TextareaAutosize
          id="incident-input"
          onChange={this.handleChangeIncident}
          style={{
            width: "350px",
            height: "400px"
          }}
          placeholder="Enter incident details (required)"
        ></TextareaAutosize>
        <InputLabel htmlFor="select-category">
          Select a category (optional):
        </InputLabel>
        <Select
          value={this.state.categories}
          onChange={this.handleChangeCategories}
          id="select-category"
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="personal">Personal incident</MenuItem>
          <MenuItem value="property">Property incident</MenuItem>
          <MenuItem value="inchoate">Inchoate (conspiracy) incident</MenuItem>
          <MenuItem value="statutory">Statutory incident</MenuItem>
          <MenuItem value="financial">Financial incident</MenuItem>
        </Select>
        <InputLabel htmlFor="file-input">
          Upload media evidence (optional):
        </InputLabel>
        <input
          id="file-input"
          type="file"
          onChange={this.handleImage}
          multiple
        ></input>
        <Button onClick={this.handleSubmit}>Submit Crime Report</Button>
      </form>
    );
  }
}
