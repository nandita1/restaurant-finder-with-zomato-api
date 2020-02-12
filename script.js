const searchForm = document.getElementById("searchForm");
const searchLoc = document.getElementById("searchLoc");

function addToDom(img, name, address, aggregate_rating, cuisines, cost) {
  const restaurant_list = document.getElementById("restaurant-list");
  const div = document.createElement("div");
  div.classList.add("col-11", "mx-auto", "my-3", "col-md-4");
  div.innerHTML = `<div class="card">
  <div class="row p-3">
   <div class="col-5">
    <img src="${img}" class="img-fluid img-thumbnail" alt="">
   </div>
   <div class="col-5 text-capitalize">
    <h6 class="text-uppercase pt-2 redText">${name}</h6>
    <p>${address}</p>
   </div>
   <div class="col-1">
    <div class="badge badge-success">
     ${aggregate_rating}
    </div>
   </div>
  </div>
  <hr>
  <div class="row my-3 ml-1">
   <div class="col-5 text-uppercase ">
    <p>cuisines:</p>
    <p>cost for two:</p>
   </div>
   <div class="col-7 text-uppercase">
    <p>${cuisines}</p>
    <p>${cost}</p>
   </div>
  </div>
  </div>`;
  restaurant_list.appendChild(div);
}

function showFeedback(msg) {
  const div = document.querySelector(".feedback");
  div.style.display = "block";
  div.innerHTML = msg;
  setTimeout(() => {
    div.style.display = "none";
  }, 3000);
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  if (searchLoc.value == "") showFeedback("Please Enter Location");
  else {
    fetch(
      `https://developers.zomato.com/api/v2.1/locations?query=${searchLoc.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-key": "e288e3ff38bf2379fcf27b72cf9a5caa"
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        if (myJson.location_suggestions.length == 0)
          showFeedback("Please Enter Correct Location");
        else {
          const entity_type = myJson.location_suggestions[0].entity_type;
          const entity_id = myJson.location_suggestions[0].entity_id;
          fetch(
            `https://developers.zomato.com/api/v2.1/search?entity_id=${entity_id}&entity_type=${entity_type}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "user-key": "e288e3ff38bf2379fcf27b72cf9a5caa"
              }
            }
          )
            .then(response => {
              return response.json();
            })
            .then(myJson => {
              const div = document.getElementById("search");
              div.innerHTML = `Showing ${myJson.results_shown} of ${myJson.results_found} results`;
              console.log(myJson.restaurants[0]);
              //let restaurants = [];
              myJson.restaurants.map(
                ({
                  restaurant: {
                    thumb: img,
                    name,
                    location: { address },
                    user_rating: { aggregate_rating },
                    cuisines,
                    average_cost_for_two: cost
                  }
                }) => {
                  addToDom(
                    img,
                    name,
                    address,
                    aggregate_rating,
                    cuisines,
                    cost
                  );
                }
              );
            });
        }
      });
  }
});
