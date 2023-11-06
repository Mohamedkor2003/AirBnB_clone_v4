// js for updating api_status and setting selected amenities list from checkboxes

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
}

$(document).ready(myfun);
