const link = "http://api.weatherstack.com/current?access_key=bd7ecea9e64f6349c0b2e242ad261076";

const root = document.getElementById('root');

let store = {
	city: "Moscow",
	feelslike: 0,
	temperature: 0,
	observationTime: "00:00 AM",
	isDay: "yes",
	description: "",
	properties: {
		cloudcover: 0,
		humidity: 0,
		windSpeed: 0,
		pressure: 0,
		visibility: 0,
		uvIndex: 0,
	},

}

const fetchData = async () => {
	const result = await fetch(`${link}&query=${store.city}`);
	const data = await result.json();

	const {
		current: { feelslike,
			cloudcover,
			temperature,
			humidity,
			observation_time: observationTime,
			pressure,
			uv_index: uvIndex,
			visibility,
			is_day: isDay,
			weather_descriptions: description,
			wind_speed: windSpeed },
	} = data;

	store = {
		...store,
		feelslike,
		temperature,
		observationTime,
		isDay,
		description: description[0],
		properties: {
			cloudcover: 0,
			humidity: 0,
			windSpeed: 0,
			pressure: 0,
			visibility: 0,
			uvIndex: 0,
		},
	}


	console.log(data)
	renderComponent()
};


const getImage = (description) => {

	switch (description) {
		case "Partly cloudy", "Overcast", "Partly":
			return 'partly.png';
		case "Clear":
			return 'clear.png';
		case "Fog", "Mist":
			return 'fog.png';
		case "Sunny":
			return 'sunny.png';
		default:
			return 'the.png';
	}
}

const renderPropertiy = () => {
	return `
		<div class="property">
			<div class="property-icon">
				<img src="./img/icons/${icon}" alt="">
			</div>
			<div class="property-info">
				<div class="property-info__value">${value}</div>
				<div class="property-description">${title}</div>
			</div>
		</div>
	`
}

const markup = () => {
	const { city, description, observationTime, temperature, isDay } = store;

	const containerClass = isDay === "yes" ? "is-day" : ""

	return `
			<div class="container ${containerClass}">
				<div class="top">
					<div class="city">
						<div class="city-subtitle">Погода сегодня</div>
						<div class="city-title" id="city">
							<span>${city}</span>
						</div>
					</div>
					<div class="city-info">
						<div class="top-left">
							<img src="./img/${getImage(description)}" alt="" class="icon">
							<div class="discription">${description}</div>
						</div>
						<div class="top-right">
							<div class="city-info__sibtitle">as of ${observationTime}</div>
							<div class="city-info__title">${temperature}°</div>
						</div>
					</div>
				</div>
				<div id="properties"></div>
			</div>
	`
}

const renderComponent = () => {
	root.innerHTML = markup();
}

fetchData();