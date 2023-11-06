// static js for amenities
$(document).ready(function () {
  const amenities = {};
  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      amenities[this.dataset.name] = this.dataset.id;
    } else {
      delete amenities[this.dataset.name];
    }
    $('div.amenities h4').text(Object.keys(amenities).sort().join(', '));
  });
});
