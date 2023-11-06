/*
  js for updating api_status, setting selected amenities list from checkboxes,
  fetching places from api on start and also when search button is clicked
  based on selected amenities.
*/

function myfun () {
  // set amenities list from checkboxes
  const selectedAmenities = {};
  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      selectedAmenities[this.dataset.name] = this.dataset.id;
    } else {
      delete selectedAmenities[this.dataset.name];
    }
    $('div.amenities h4').text(Object.keys(selectedAmenities).sort().join(', '));
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

        placeArticle.append(titleBox, information, description);

        $('section.places').append(placeArticle);
      }
    }
  });

  // fetches places from api based on selected amenities
  $('button[type=button]').on('click', function () {
    const amenitIds = [];
    Object.values(selectedAmenities).forEach(function (amenitId) {
      amenitIds.push(amenitId);
    });

    const searchUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
    $.ajax({
      url: searchUrl,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({ amenities: amenitIds }),
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

          placeArticle.append(titleBox, information, description);

          $('section.places').append(placeArticle);
        }
      }
    });
  });
}

$(document).ready(myfun);
