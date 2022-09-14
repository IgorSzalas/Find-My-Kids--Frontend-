console.log("Starting")

const username = document.getElementById("username")
const password = document.getElementById("password")
const loginButton = document.querySelector(".login-btn")
const loginForm = document.querySelector(".login-form")
const registerForm = document.querySelector(".register-form")
const mapOnPage = document.getElementById("map")
const registerButtonAfter = document.getElementById("register-button-after")
const registerButton = document.querySelector(".register-btn")
const staticLogo = document.querySelector(".static-logo")
const fieldKey = document.querySelector(".field-key")
const buttons = document.querySelector(".buttons")
const listOfDevices = document.querySelector(".list-of-devices")
const deleteButton = document.querySelector(".delete-button")
const addButton = document.querySelector(".add-button")
const refreshButton = document.querySelector(".refresh-button")
const link = "https://kakarow.pythonanywhere.com/"
//const link = "http://127.0.0.1:8000/"
/*****************************************************************/
/*Map*/

let length = 12
let latitude = 23

let map = L.map("map").setView([latitude, length], 13)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

let marker = L.marker([latitude, length]).addTo(map)
/*****************************************************************/

const Login = async () => {
  const response = await fetch(`${link}api/auth/login/`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": document.cookie.substring(10),
      Cookie: document.cookie,
      Referer: "https://igorszalas.github.io",
    },
  })
  username.value = ""
  password.value = ""
  const myJSON = await response.json()
  console.log(response)
  if (response.status === 200) {
    console.log("success")
    loginForm.style.display = "none"
    staticLogo.style.display = "flex"
    mapOnPage.style.display = "block"
    fieldKey.style.display = "flex"
    buttons.style.display = "flex"
    listOfDevices.style.display = "flex"
    getDevices()
    refreshMap()
    map.invalidateSize()
  } else {
    console.error(`Error. Error code is ${response.status}.`)
    console.log(myJSON)
  }
}

loginButton.addEventListener("click", Login)
loginButton.addEventListener("keypress", (e) => {
  if (e.key === "Enter") Login()
})

registerButton.addEventListener("click", () => {
  loginForm.style.display = "none"
  registerForm.style.display = "flex"
})

const Register = async () => {
  const response = await fetch(`${link}api/auth/register/`, {
    method: "POST",
    body: JSON.stringify({
      username: usernameRegister.value,
      email: email.value,
      password1: password1.value,
      password2: password2.value,
    }),
    headers: { "Content-Type": "application/json" },
  })
  username.value = ""
  email.value = ""
  password1.value = ""
  password2.value = ""
  const myJSONregister = await response.json()

  if (response.status === 200) {
    console.log("Success")
    loginForm.style.display = "none"
    mapOnPage.style.display = ""
  } else {
    console.error(`Error. Error code is ${response.status}.`)
    console.log(myJSONregister)
  }
}
registerButtonAfter.addEventListener("click", Register)

// const GetList = async () => {
//   const response = await fetch(`${link}api/devices/getList/`, {
//     /*method: "GET",*/ /*-> get is default*/ credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       "x-csrftoken": document.cookie.substring(10),
//       Cookie: document.cookie,
//     },
//   })
//   const myJSONGetList = await response.json()
//   console.log(myJSONGetList)
// }

loginButton.addEventListener("click", getDevices)

const responseStatus = async (response) => {
  const jsons = await response.json()
  if (response.status === 200) {
    console.log("Success")
  } else {
    console.log(jsons)
    console.log(document.cookie)
  }
  return jsons
}

const getDevices = async () => {
  let data = {}
  const url = `${link}api/devices/getList/`
  const response = await fetch(url, {
    method: "get",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-csrftoken": document.cookie.substring(10),
      Cookie: document.cookie,
    },
  })
  responseStatus(response)
}

const refreshMap = async () => {
  let data = await getInfo()
  posX = data["latitude"]
  posY = data["length"]
  map.setView([posX, posY], 13)
  marker.setLatLng([posX, posY])
}

const getInfo = async () => {
  let data = {}
  const url = `${link}api/devices/getPosition/?id=2`
  const response = await fetch(url, {
    method: "get",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-csrftoken": document.cookie.substring(10),
      Cookie: document.cookie,
    },
  })
  return responseStatus(response)
}
refreshButton.addEventListener("click", refreshMap)
/*
setInterval(
  L.marker([latitude, length])
    .addTo(map)
    .bindPopup("<b>Siemanko tu Karol!</b><br />Zdam Ci kolosa byQ")
    .openPopup(),
  500
)
let circle = L.circle([51.508, -0.11], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
})
  .addTo(map)
  .bindPopup("I am a circle.")*/
/*
let polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
])
  .addTo(map)
  .bindPopup("I am a polygon.")

let popup = L.popup()
  .setLatLng([51.513, -0.09])
  .setContent("I am a standalone popup.")
  .openOn(map)

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map)
}

map.on("click", onMapClick)
*/
