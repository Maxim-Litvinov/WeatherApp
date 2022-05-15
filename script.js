const link = "http://api.weatherstack.com/current?access_key=bd7ecea9e64f6349c0b2e242ad261076";

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');
const close = document.getElementById('close');

let store = {
	city: "Moscow",
	feelslike: 0,
	temperature: 0,
	observationTime: "00:00 AM",
	isDay: "yes",
	description: "",
	properties: {
		cloudcover: {},
		humidity: {},
		windSpeed: {},
		pressure: {},
		visibility: {},
		uvIndex: {},
	},

}

const fetchData = async () => {
	try {
		const query = localStorage.getItem('query') || store.city;
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
				cloudcover: {
					title: 'Cloud Cover',
					value: `${cloudcover} %`,
					icon: 'clound.png',
				},
				humidity: {
					title: 'Humidity',
					value: `${humidity} %`,
					icon: 'humidity.png'
				},
				windSpeed: {
					title: 'Wind Speed',
					value: `${windSpeed} км/ч`,
					icon: 'wind.png'
				},
				pressure: {
					title: 'Pressure',
					value: `${pressure} %`,
					icon: 'gauge.png'
				},
				visibility: {
					title: 'Vsibility',
					value: `${visibility} %`,
					icon: 'humidity.png'
				},
				uvIndex: {
					title: 'Uv Index',
					value: `${uvIndex} / 100`,
					icon: 'uv-index.png'
				},
			},
		}

		renderComponent()
		city.addEventListene('click', handleClick);
	} catch (err) {
		console.log(err)
	}
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

const renderPropertiy = (properties) => {
	return Object.values(properties).map(([title, value, icon]) => {
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
	`;
	}).join("");
};

const markup = () => {
	const { city, description, observationTime, temperature, isDay, properties } = store;

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
							<div class="city-info__sibtitle">Время ${observationTime}</div>
							<div class="city-info__title">${temperature}°</div>
						</div>
					</div>
				</div>
				<div id="properties">${renderPropertiy(properties)}</div>
			</div>
	`
}


const renderComponent = () => {
	const city = document.getElementById('city');
	root.innerHTML = markup();
}

const handleClick = () => {
	popup.classList.toggle('active')
}

const handleInput = () => {
	store = {
		...store,
		city: e.target.value,
	}
}

const handleSubmit = (e) => {
	e.preventDefault()

	const value = store.city

	if (!store.city) return null
	localStorage.setItem('query', value)
	fetchData()
	handleClick()

}

const handleClose = () => {
	popup.classList.toggle('active')
}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput);
close.addEventListener('click', handleClose)

fetchData();