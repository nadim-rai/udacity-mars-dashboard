// Immutable state object
let store = Immutable.Map({
    user: Immutable.Map({ name: 'Student' }),
    apod: '',
    rovers: Immutable.List(['curiosity', 'opportunity', 'spirit']),
    display: false,
    roverData: ''
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header>
            <div class="image_container">
                <img src="./assets/mars_rover.png" alt="Mars rover"></a>
            </div>
        </header>
        <main>
            <section>
                ${Greeting(store.get('user').get('name'))}
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(store.get('apod'))}
            </section>
            <section class="mars_dash">
                <h1>Mars Rovers</h1>
                <div class="rovers_container">
                     <div class="rover_info">
                        ${!store.get('display') ? 
                         `${DefaultImage()}
                         ` : 
                         `${RoverData()}`
                     } 
                     </div>
                    <div class="rover_list">
                        ${RoversList(state)}
                    </div>
                </div>
            </section>

        </main>
        <footer>
          <div> &copy; Udacity Project 2023 </div>
        </footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)

    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.image.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <div class="apod_image_container">
                <div class="apod_image">
                    <img src="./assets/mars_rover.png" alt="Mars rover">
                </div>
                <div class="apod_text">
                    <p>${apod.image.title}</p>
                    <p>${apod.image.explanation}</p>
                </div>
            </div>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

const DefaultImage = () =>{
    return `<div class="default_image">
             <img src="./assets/mars_rover.png" alt="Mars rover">
            </div>
            `
}
const RoversList = (state) => {
    return`
        <ul class="rover_list_ul">${Array.from(state.get('rovers')).map( item => 
                `<li id=${item}  onclick="getId(event)">
                   ${`${item}`}
                </li>`
                ).join("")}
        <ul>
    `   
}
const getId = (e) => {
    const rover = e.srcElement.id;
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let apod  = state.get('apod');

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}