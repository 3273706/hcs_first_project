const content = document.querySelector("#content");
const addButton = document.querySelector("#addCityButton");
const addCityModal = document.querySelector("#addCity");

const destinationList = [];

createFromLocalStorage();

// Add Event Listener

addButton.addEventListener("click", function (event) {
  addCityModal.classList.add("is-active");
});

content.addEventListener("click", function (event) {
  if (event.target.dataset.action) {
    switch (event.target.dataset.action) {
      case "edit":
        console.log("this was edit");
        editCard(event);
        break;
      case "delete":
        deleteCard(event);
        break;
      case "save":
        saveChanges(event);
        break;
      default:
        break;
    }
  }
});

addCityModal.addEventListener("click", function (event) {
  if (event.target.dataset.action) {
    switch (event.target.dataset.action) {
      case "addCity":
        closeModal();
        addCity("hallo hier wurde eine ausgewählt");
      case "closeModal":
        closeModal();
        break;
      case "searchCities":
        console.log("search city!!");
        searchCities(document.querySelector("#inputCityName").value);
        break;
      default:
        break;
    }
  }
});

function closeModal() {
  console.log("ciao Modal");
  addCityModal.classList.remove("is-active");
}
function searchCities(searchString) {
  getCityData(searchString);
}
function addCity(destination) {
  console.log(document.querySelector("#selectBox").selectedOptions[0]);

  if (document.querySelector("#selectBox").selectedOptions[0].dataset.payload) {
    // Add a new Card for the result
    const destination = createDestionation();

    // Parse the Payload
    const selectedCity = JSON.parse(
      document.querySelector("#selectBox").selectedOptions[0].dataset.payload
    );
    console.log(selectedCity);
    destination.cityname = selectedCity.city;
    destination.country = selectedCity.country;
    destination.latitude = selectedCity.latitude;
    destination.longitude = selectedCity.longitude;
    destination.population = selectedCity.population;
    destination.apiCityId = selectedCity.id;
    destination.countryCode = selectedCity.countryCode;

    getCityWeather(destination);
  }
}

function getCityData(name) {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${name}&languageCode=${window.navigator.language}&types=CITY&sort=-population`;
  console.log(url);
  //x-rapidapi-key
  //7bc9524435msh8f210de9cb63cb8p17df69jsn50fb089490e9

  fetch(url, {
    headers: {
      "x-rapidapi-key": "7bc9524435msh8f210de9cb63cb8p17df69jsn50fb089490e9",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      createResultList(result.data);
    })
    .catch(function (error) {
      console.log(error);
      console.log("Its a Error-> TERROR!!!");
    });
}

function createResultList(foundCities) {
  console.log(foundCities);
  let resultList = "";
  const searchBar = document.querySelector("#addCity");

  if (searchBar.querySelector(".select")) {
    resultList = searchBar.querySelector(".select");
    resultList.innerHTML = "";
  } else {
    resultList = document.createElement("div");
    resultList.classList = "select is-multiple";
  }

  const selectBox = document.createElement("select");
  selectBox.multiple = true;
  selectBox.size = foundCities.length;
  selectBox.id = "selectBox";

  resultList.appendChild(selectBox);

  for (let i = 0; i < foundCities.length; i++) {
    const selectOption = document.createElement("option");
    selectOption.value = foundCities[i].city;
    selectOption.innerHTML = `${foundCities[i].city},${foundCities[i].country}`;
    selectOption.setAttribute("data-payload", JSON.stringify(foundCities[i]));
    selectBox.appendChild(selectOption);
  }
  searchBar.appendChild(resultList);
}

function createDestionation() {
  return {
    id: Math.round(Math.random() * 10000),
    cityname: "",
    country: "",
    countryCode: "",
    vacationStart: 0,
    vactionEnd: 0,
    imageURL: "",
    weather: {
      icon: "",
      temp: 0,
    },
    description: "",
    longitude: 0,
    latitude: 0,
    population: 0,
    apiCityId: 0,
    cardReference: "",
    editButton: "",
    deleteButton: "",
  };
}

function getCityWeather(destination) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "7bc9524435msh8f210de9cb63cb8p17df69jsn50fb089490e9",
      "X-RapidAPI-Host": "yahoo-weather5.p.rapidapi.com",
    },
  };

  fetch(
    `https://yahoo-weather5.p.rapidapi.com/weather?lat=${destination.latitude}&long=${destination.longitude}&format=json&u=f`,
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      destination.weather = {
        temp: response.current_observation.condition.temperature,
        icon: response.current_observation.condition.code,
      };
      addCard(destination);
    })
    .catch((err) => console.error(err));
}

function addCard(destination) {
  destination.cardReference = document.createElement("div");
  destination.cardReference.setAttribute("data-id", destination.id);
  destination.cardReference.innerHTML = `<div class="column">
  <div class="card" data-id="${destination.id}">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="city_placeholder.jpg" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48 has-background-grey-lighter">
            <img src="images/mono_flat/${
              destination.weather.icon
            }.png" alt="Placeholder image" />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">
          ${destination.cityname} <span class="tag is-dark"> ${Math.round(
    (destination.weather.temp - 32) * (5 / 9)
  )}° </span>
            <span class="tag is-dark"> ${destination.country} </span>
            <span class="tag">
              <img
                class="image is-32x32"
                src="https://countryflagsapi.com/svg/${destination.countryCode}"
                alt="Placeholder image"
              />
            </span>
          </p>
          <p class="subtitle is-6"></p>
          <div class="columns">
            <div class="column">
              <label class="label">From</label>
              <input data-id="from" disabled="true" class="input" type="text" value="${
                destination.vacationStart
              }" /> 
            </div>
            <div class="column">
              <label class="label">To</label>
              <input data-id="to" disabled="true" class="input" type="text" value="${
                destination.vacationEnd
              }" />
            </div>
            <div></div>
          </div>
  
          <div class="content">
            <textarea
              disabled="true"
              class="textarea is-info"
              placeholder="Describe your Trip"
            >${destination.description}</textarea>
          </div>
          <footer class="card-footer">
          <button
            data-action="save"
            class="card-footer-item button is-dark"
            disabled="true"
          >
            Save
          </button>
          <button
            data-action="edit"
            class="card-footer-item button is-dark"
          >
            Edit
          </button>
          <button data-action="delete" class="card-footer-item button">
            Delete
          </button>
        </footer>
        </div>
      </div>
    </div>
  </div>
  </div>`;

  content.appendChild(destination.cardReference);
  addToLocalStorage(destination.id, destination);
  destinationList.push(destination);
  return destination;
}

function editCard(event) {
  const inputElement =
    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
      ":disabled"
    );

  inputElement.forEach((element) => {
    element.disabled = false;
  });
}

function saveChanges(event) {
  const id =
    event.target.parentElement.parentElement.parentElement.parentElement
      .parentElement.dataset.id;

  //find Card Reference
  const destination = destinationList.find((destination) => {
    if (destination.id == id) {
      return destination;
    }
  });

  console.log(destination);

  const inputElement =
    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
      "input"
    );

  inputElement.forEach((element) => {
    element.disabled = true;
    if (element.dataset.id == "from") {
      destination.vacationStart = element.value;
    } else {
      destination.vacationEnd = element.value;
    }
  });

  const textElement =
    event.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
      "textarea"
    );

  textElement.forEach((element) => {
    element.disabled = true;
    destination.description = element.value;
  });

  event.target.disabled = true;
  addToLocalStorage(id, destination);
}

function deleteCard(event) {
  console.log(
    event.target.parentElement.parentElement.parentElement.parentElement
      .parentElement.dataset.id
  );
  const id =
    event.target.parentElement.parentElement.parentElement.parentElement
      .parentElement.dataset.id;

  removeFromLocalStorage(id);

  const elements = content.querySelectorAll(`[data-id="${id}"]`);
  elements.forEach((element) => {
    if (element.className !== "card") {
      content.removeChild(element);
    }
  });
}
function removeFromLocalStorage(id) {
  // Find the object in the ID array and remove it
  const idSet = JSON.parse(localStorage.getItem("idSet"));
  for (let i = 0; i < idSet.length; i++) {
    console.log(idSet[i]);
    console.log(id);
    if (idSet[i] == id) {
      idSet.splice(i, 1);
      localStorage.removeItem(id);
      break;
    }
  }
  localStorage.setItem("idSet", JSON.stringify(idSet));
}
function addToLocalStorage(id, data) {
  // Add ID to local storage ID Array -> check if the ID already exists, incase of that, do nothing
  let idSet = localStorage.getItem("idSet");
  if (!idSet) {
    idSet = [];
    idSet.push(id);
    localStorage.setItem("idSet", JSON.stringify(idSet));
  } else {
    idSet = JSON.parse(localStorage.getItem("idSet"));
    if (
      !idSet.find((entry) => {
        if (entry == id) {
          return entry;
        }
      })
    ) {
      idSet.push(id);
      localStorage.setItem("idSet", JSON.stringify(idSet));
    }
  }

  // Add Data with the ID to local Storage -> automatically replace
  localStorage.setItem(id, JSON.stringify(data));
}

function createFromLocalStorage() {
  let idSet = localStorage.getItem("idSet");
  if (idSet) {
    idSet = JSON.parse(localStorage.getItem("idSet"));
    for (let i = 0; i < idSet.length; i++) {
      const destination = addCard(JSON.parse(localStorage.getItem(idSet[i])));
      updateCityWeather(destination);
    }
  }
}

function updateCityWeather(destination) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "7bc9524435msh8f210de9cb63cb8p17df69jsn50fb089490e9",
      "X-RapidAPI-Host": "yahoo-weather5.p.rapidapi.com",
    },
  };

  fetch(
    `https://yahoo-weather5.p.rapidapi.com/weather?lat=${destination.latitude}&long=${destination.longitude}&format=json&u=f`,
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      destination.weather = {
        temp: response.current_observation.condition.temperature,
        icon: response.current_observation.condition.code,
      };
      // // Weather Icon
      // // Get Weather Icon
      // const weatherIcon = destination.cardReference
      //   .querySelector(".text")
      //   .querySelector(".weatherPicture");
      // weatherIcon.src = `images/mono_flat/${destination.weather.icon}.png`;

      // //Get Temperature
      // const temperature = destination.cardReference.querySelector("span");
      // console.log(temperature);
      // temperature.innerHTML = `${Math.round(
      //   (destination.weather.temp - 32) * (5 / 9)
      // )}°`;
    })
    .catch((err) => console.error(err));
}
