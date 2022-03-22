const adultPrice = 100;
const childPrice = 60;
const seniorPrice = 65;

function getTotal() {
  let booking = getStorage("booking");
  let total = 0;
  if (booking.adults > 0) {
    total += booking.adults * adultPrice;
  }

  if (booking.children > 0) {
    total += booking.children * childPrice;
  }

  if (booking.seniors > 0) {
    total += booking.seniors * seniorPrice;
  }
  return total;

}

function getStorage(key) {
  return JSON.parse(window.sessionStorage.getItem(key));
}

function setStorage(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function randomId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}