import React from "react";
import "./menu.css";
import WeatherData from "../data/Data";
import cityData from "./city.list.json";
import logo from "./logo_blackletter.png";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputCity: "",
      autoCompleteCityNames: [],
      citySearchResult: "",
      celsiusChecked: "",
      fahrenheitChecked: "checked",
      /**
       * Latitude et longitude de la ville de montréal
       */
      city: {
        lat: 45.50832,
        lon: -73.566431,
        name: "MONTREAL",
      },

      unites: "imperial", //celsius:"metric" (fahrenheit: "imperial"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTemperatureFormat = this.handleTemperatureFormat.bind(this);
  }
  //choose city from dropdown list then display choosed city on input panel
  handleClick(event) {
    let listCity = event.target.getAttribute("data-item").toLowerCase();
    this.setState({ inputCity: listCity });
  }
  //save input city name in state and popup dropdown menu to display first 5 search results in database to help autocomplete city name in input panel
  handleChange(event) {
    let filterCity = [];
    let testCity;
    let patt = new RegExp(event.target.value);
    cityData.filter(function (city) {
      testCity = patt.test(city.name.toLowerCase());
      if (testCity) filterCity.push(city);
    });
    //console.log(event.target.value, filterCity);
    filterCity.length >= 1
      ? this.setState({
          inputCity: event.target.value,
          autoCompleteCityNames: filterCity.slice(0, 10),
        })
      : this.setState({ inputCity: event.target.value });
    if (event.target.value === "") this.setState({ autoCompleteCityNames: [] });
  }
  //validate city name in database then assign city data to weather info component for updating info
  handleSubmit(event) {
    event.preventDefault();

    let testInput = cityData.find(
      (item) => this.state.inputCity === item.name.toLowerCase()
    );

    if (testInput) {
      for (let i = 0; i <= cityData.length; i++) {
        if (this.state.inputCity === cityData[i].name.toLowerCase()) {
          this.setState({
            city: {
              lat: cityData[i].coord.lat,
              lon: cityData[i].coord.lon,
              name: this.state.inputCity,
            },
            citySearchResult: "",
            autoCompleteCityNames: [],
          });

          break;
        }
      }
    } else {
      this.setState({ citySearchResult: "false" });
    }
  }

  //temperature format switch for celsius and fahrenheit
  handleTemperatureFormat(event) {
    if (event.target.value === "metrics") {
      this.setState({
        unites: event.target.value,
        celsiusChecked: "checked",
        fahrenheitChecked: "",
      });
    }
    if (event.target.value === "imperial") {
      this.setState({
        unites: event.target.value,
        celsiusChecked: "",
        fahrenheitChecked: "checked",
      });
    }
  }
  render() {
    //jsx can't use onclick get dom value in table element, it only can access data by attribute, use getAttribute to transfer parameter
    return (
      <div>
        <a href="https://leonzhang51.github.io/">
          <img src={logo} alt="logo" style={{ width: "4vw" }}></img>
        </a>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search Location,city name"
            value={this.state.inputCity}
            onChange={this.handleChange}
          />

          <input type="submit" value="confirm" />
        </form>
        <table>
          <tbody>
            {this.state.autoCompleteCityNames.map(
              (autoCompleteCityName, index) => (
                <tr key={index}>
                  <td
                    data-item={autoCompleteCityName.name}
                    onClick={this.handleClick}
                  >
                    {autoCompleteCityName.name} {autoCompleteCityName.country}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <p className="error">
          {this.state.citySearchResult !== ""
            ? "city name not in our database, please input another one!"
            : ""}
        </p>
        <label className="text-white">Celsius</label>
        <input
          type="radio"
          value="metrics"
          className="mx-2"
          checked={this.state.celsiusChecked}
          onChange={this.handleTemperatureFormat}
        />
        <label className="text-white">Fahrenheit</label>
        <input
          type="radio"
          value="imperial"
          className="mx-2"
          checked={this.state.fahrenheitChecked}
          onChange={this.handleTemperatureFormat}
        />

        <WeatherData city={this.state.city} unites={this.state.unites} />
      </div>
    );
  }
}

export default Menu;
