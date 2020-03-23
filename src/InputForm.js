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
import logo from "./images/CrimeAnon.png";

export default class InputForm extends React.Component {
  state = {
    incident: "",
    categories: ["none"],
    zip: "",
    image: [],
    reportReady: false,
    report: []
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
    let input = e.target;

    for (let i = 0; i < input.files.length; i++) {
      console.log(input.files);

      let reader = new FileReader();
      reader.onload = b =>
        this.setState({ image: this.state.image.concat(b.target.result) });
      reader.readAsDataURL(input.files[i]);
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    axios
      .post("http://localhost:2500/crimes", {
        incident: this.state.incident,
        categories: this.state.categories,
        zip: this.state.zip,
        image: this.state.image
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleReport = async event => {
    axios.get(`http://localhost:2500/crimes`).then(res => {
      const report = res.data;
      this.setState({ report });
    });
    this.setState({ reportReady: true });
  };

  handleImages = () => {
    return <ul></ul>;
  };

  render() {
    if (this.state.reportReady) {
      if (this.state.report.CrimeInstance === undefined) {
        return <h1>Loading</h1>;
      } else {
        return (
          <div id="crime-report">
            <h2>
              Zip code:{" "}
              {
                this.state.report.CrimeInstance[
                  this.state.report.CrimeInstance.length - 1
                ].zip
              }
            </h2>
            <h2>
              Incident:{" "}
              <div id="crime-text">
                {
                  this.state.report.CrimeInstance[
                    this.state.report.CrimeInstance.length - 1
                  ].incident
                }
              </div>
            </h2>
            <h2>
              Type of crime:{" "}
              {
                this.state.report.CrimeInstance[
                  this.state.report.CrimeInstance.length - 1
                ].categories
              }
            </h2>
            <ul>
              <h2>Images of crime scene: </h2>
              <div id="crime-images">
                {this.state.report.CrimeInstance[
                  this.state.report.CrimeInstance.length - 1
                ].image.map(x => (
                  <li>
                    <img src={x} height="300px" width="300px"></img>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        );
      }
    }
    return (
      <form id="input-form">
        <img src={logo} alt="Crime Anon logo"></img>
        <InputLabel htmlFor="incident-input" id="input-label">
          Tell us about your incident (required):
        </InputLabel>
        <input
          id="zip-input"
          style={{ width: "350px" }}
          onChange={this.handleZip}
          placeholder="Enter incident ZIP code (required)"
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
        <InputLabel htmlFor="select-category" id="input-label">
          Select a category (optional):
        </InputLabel>
        <Select
          value={this.state.categories}
          onChange={this.handleChangeCategories}
          className="select-category"
          MenuProps={{ MenuListProps: { disablePadding: true } }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="personal">Personal incident</MenuItem>
          <MenuItem value="property">Property incident</MenuItem>
          <MenuItem value="inchoate">Inchoate (conspiracy) incident</MenuItem>
          <MenuItem value="statutory">Statutory incident</MenuItem>
          <MenuItem value="financial">Financial incident</MenuItem>
        </Select>
        <InputLabel htmlFor="file-input" className="input-label">
          Upload media evidence (optional):
        </InputLabel>
        <input
          id="file-input"
          type="file"
          onChange={this.handleImage}
          multiple
        ></input>
        <Button onClick={this.handleSubmit} className="submit-crime">
          Submit Crime Report
        </Button>
        <Button onClick={this.handleReport} id="get-report">
          Click to view your full report
        </Button>
      </form>
    );
  }
}
