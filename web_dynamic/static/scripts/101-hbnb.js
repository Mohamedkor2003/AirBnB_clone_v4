/*
  js for updating api_status, setting selected amenities, states and cities
  list from checkboxes, fetching places from api on start and also when
  search button is clicked based on selected amenities, states and cities.
  Also adds reviews to each place articles.
*/

function myfun () {
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCitites = {};

  // set amenities list from checkboxes
  $('div.amenities li input[type=checkbox]').change(function () {
    if (this.checked) {
      selectedAmenities[this.dataset.name] = this.dataset.id;
    } else {
      delete selectedAmenities[this.dataset.name];
    }
    $('div.amenities h4').text(Object.keys(selectedAmenities).sort().join(', '));
  });

  // set states list from checkboxes
  $('input.state_check').change(function () {
    if (this.checked) {
      selectedStates[this.dataset.name] = this.dataset.id;
    } else {
      delete selectedStates[this.dataset.name];
    }
    const combinedList = Object.keys(selectedStates).sort();
    const cityList = Object.keys(selectedCitites).sort();
    combinedList.push.apply(combinedList, cityList);
    $('div.locations h4').text(combinedList.join(', '));
  });

  // set cities list from checkboxes
  $('input.city_check').change(function () {
    if (this.checked) {
      selectedCitites[this.dataset.name] = this.dataset.id;
    } else {
      delete selectedCitites[this.dataset.name];
    }
    const combinedList = Object.keys(selectedStates).sort();
    const cityList = Object.keys(selectedCitites).sort();
    combinedList.push.apply(combinedList, cityList);
    $('div.locations h4').text(combinedList.join(', '));
  });

  // check api_status
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, function (data) {
    if (data.status === 'OK') $('div#api_status').addClass('available');
    else $('div#api_status').removeClass('available');
  });

  // fetch places from api at start
  const postUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
  $.ajax({
    url: postUrl,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify({}),
    contentType: 'application/json;',
    success: function (data) {
      const places = data.sort((a, b) => a.name.localeCompare(b.name));
      for (const place of places) {
        const placeArticle = $('<article></article');

        const titleBox = $('<div></div>').addClass('title_box');
        titleBox.append($('<h2>' + place.name + '</h2>'));
        titleBox.append($('<div class="price_by_night">$' + place.price_by_night + '</div>'));

        const information = $('<div></div>').addClass('information');
        information.append('<div class="max_guest">' + place.max_guest + 'Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_rooms">' + place.number_rooms + 'Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_bathrooms">' + place.number_bathrooms + 'Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');

        const description = $('<div class="description">' + place.description + '</div>');

        // fetch reviews for this place and create reviews div element
        const reviews = $('<div class="reviews"></div>');
        const reviewsUrl = 'http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews';
        $.get(reviewsUrl, function (data) {
          reviews.append('<h2>' + data.length + ' Review' + (data.length > 1 ? 's' : '') + '</h2>');
          const reviewsList = $('<ul></ul>');
          for (const review of data) {
            const reviewItem = $('<li><h3>By User: ' + review.user_id + '<br>Date: ' + review.updated_at.split('T')[0] + '</h3><p>' + review.text + '</p></li>');
            reviewsList.append(reviewItem);
          }
          reviews.append(reviewsList);
        });

        placeArticle.append(titleBox, information, description, reviews);

        $('section.places').append(placeArticle);
      }
    }
  });

  // fetches places from api based on selected amenities, states and cities
  $('button[type=button]').on('click', function () {
    const amenityIds = [];
    const stateIds = [];
    const cityIds = [];
    Object.values(selectedAmenities).forEach((amenityId) => amenityIds.push(amenityId));
    Object.values(selectedStates).forEach((stateId) => stateIds.push(stateId));
    Object.values(selectedCitites).forEach((cityId) => cityIds.push(cityId));

    $.ajax({
      url: postUrl,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({ amenities: amenityIds, states: stateIds, cities: cityIds }),
      contentType: 'application/json;',
      success: function (data) {
        const places = data.sort((a, b) => a.name.localeCompare(b.name));
        $('section.places').empty();
        for (const place of places) {
          const placeArticle = $('<article></article');

          const titleBox = $('<div></div>').addClass('title_box');
          titleBox.append($('<h2>' + place.name + '</h2>'));
          titleBox.append($('<div class="price_by_night">$' + place.price_by_night + '</div>'));

          const information = $('<div></div>').addClass('information');
          information.append('<div class="max_guest">' + place.max_guest + 'Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
          information.append('<div class="number_rooms">' + place.number_rooms + 'Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
          information.append('<div class="number_bathrooms">' + place.number_bathrooms + 'Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');

          const description = $('<div class="description">' + place.description + '</div>');

          // fetch reviews for this place and create reviews div element
          const reviews = $('<div class="reviews"></div>');
          const reviewsUrl = 'http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews';
          $.get(reviewsUrl, function (data) {
            reviews.append('<h2>' + data.length + ' Review' + (data.length > 1 ? 's' : '') + '</h2>');
            const reviewsList = $('<ul></ul>');
            for (const review of data) {
              const reviewItem = $('<li><h3>By User: ' + review.user_id + '<br>Date: ' + review.updated_at.split('T')[0] + '</h3><p>' + review.text + '</p></li>');
              reviewsList.append(reviewItem);
            }
            reviews.append(reviewsList);
          });

          placeArticle.append(titleBox, information, description, reviews);

          $('section.places').append(placeArticle);
        }
      }
    });
  });
}

$(document).ready(myfun);
