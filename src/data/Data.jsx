import React from "react";
import "./Data.css";

class WeatherData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }
  fetchData(props) {
    fetch(
      //use ajax method to access weather info from www.openweathermap.org
      //"http://api.openweathermap.org/data/2.5/forecast?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18"
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        this.props.city.lat +
        "&lon=" +
        this.props.city.lon +
        "&exclude=hourly&appid=d372021858e26c181fc642ca0f0dbd18&units=imperial"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result, //object which include all the weather information
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  componentDidMount() {
    this.fetchData();
  }
  //check the chang of props, if changed it need re fetch data from server by changed props
  componentDidUpdate(prevProps) {
    if (
      this.props.city.name !== prevProps.city.name ||
      this.props.unites !== prevProps.unites
    ) {
      this.fetchData();
    }
  }
  // To access url of weather information logo
  get_icon_url = (icon_id) => {
    const base_icon_url = "https://openweathermap.org/img/w/";
    return base_icon_url + icon_id + ".png";
  };

  /**
   * Fournir heure au format hh:mm à partir d'un timestamp
   */
  dt_a_hm = (dt) => {
    let date = new Date(dt * 1000);

    return (
      ("0" + date.getHours()).substr(-2) +
      "h" +
      (date.getMinutes() + "0").substr(0, 2)
    );
  };
  //Fahrenheit to celsius
  f_to_c = (f) => {
    return (((f - 32) * 5) / 9).toFixed(1);
  };
  //get date info from timestamp
  dt_date = (dt, option) => {
    let date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", option);
  };

  current_weather = (items) => {
    //output date format
    let option = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return (
      <div className="current_weather ">
        <div className="detail_info">
          <div className="side_info">
            <p>
              Low<br></br>
              {this.props.unites === "imperial"
                ? items.daily[0].temp.min.toFixed(1)
                : this.f_to_c(items.daily[0].temp.min)}
              {this.props.unites !== "imperial" ? " C\u00b0" : " F\u00b0"}
            </p>
          </div>
          <div className="center_info">
            <h1>{this.props.city.name}</h1>

            <p>{this.dt_date(items.daily[0].dt, option)}</p>
            <h4>
              {this.props.unites === "imperial"
                ? items.daily[0].temp.morn.toFixed(1)
                : this.f_to_c(items.daily[0].temp.morn)}
              {this.props.unites !== "imperial" ? " C\u00b0" : " F\u00b0"}
            </h4>

            <h5>{items.daily[0].weather[0].main}</h5>
          </div>
          <div className="side_info">
            <p>
              High<br></br>
              {this.props.unites === "imperial"
                ? items.daily[0].temp.max.toFixed(1)
                : this.f_to_c(items.daily[0].temp.max)}
              {this.props.unites !== "imperial" ? " C\u00b0" : " F\u00b0"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  future_7Days = (items) => {
    let option = {
      weekday: "long",
    };
    let newItems = items.daily.slice(1, items.daily.length); //remove first data(current date info), keep following 7 days info

    return (
      <div>
        <div className="future_7days">
          {newItems.map((item, index) => (
            <div key={index} className="info_day">
              <h6>{this.dt_date(item.dt, option)}</h6>
              <img
                src={this.get_icon_url(item.weather[0].icon)}
                alt="weather log"
              ></img>
              <p>{item.weather[0].main}</p>
              <p>
                {this.props.unites === "imperial"
                  ? item.temp.day.toFixed(1)
                  : this.f_to_c(item.temp.day)}

                {this.props.unites !== "imperial" ? " C\u00b0" : " F\u00b0"}
              </p>
            </div>
          ))}
        </div>
        <img
          src="https://img.icons8.com/color/36/000000/react-native.png"
          alt="react logo"
        ></img>
        <p style={{ color: "white" }}>code in React JS</p>
      </div>
    );
  };
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      //console.log(items);
      return (
        <div>
          {this.current_weather(items)}
          {this.future_7Days(items)}
        </div>
      );
    }
  }
}

export default WeatherData;
