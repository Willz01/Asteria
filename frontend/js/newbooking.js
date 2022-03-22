async function reserveSeat(seatId) {
  console.log(seatId)
  let user = JSON.parse(atob(getSavedSession()))
  console.log(user.userId)
  let booking = getStorage("booking");
  if (user.userId === undefined) {
    history.pushState(null, null, "http://localhost:5601/signUp");
    router();
  }

  let totalPersons = booking.adults + booking.children + booking.seniors;
  if (totalPersons > 0) {
    let databaseBooking = await (await fetch("http://localhost:5600/api/bookings/" + booking.bookingId)).json();
    console.log("db: " + databaseBooking)

    if (databaseBooking === null) {
      await fetch("http://localhost:5600/api/bookings/new-booking", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "bookingId": booking.bookingId,
          "userId": booking.userId,
          "adults": booking.adults,
          "children": booking.children,
          "seniors": booking.seniors,
        })
      });
    }
    let screening = getStorage("screening");
    let reservation = await (await fetch("http://localhost:5600/api/bookings/full-booking/" + booking.bookingId)).json();
    if (reservation != null && totalPersons > 0) {
      await fetch("http://localhost:5600/api/reservedseat/new-reservation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "bookingId": booking.bookingId,
          "screeningId": screening.screeningId,
          "seatId": seatId,
          "dateTime": Date.now(),
          "isTemp": 1,
        })
      });
    }
  } else {
    alert("Please add tickets to add seats")
  }
  document.window.location.reload(false)
  newBooking()
}

async function unreserveSeat(seatId) {

  const booking = getStorage("booking");
  const reqBody = {
    "bookingId": booking.bookingId,
    "seatId": seatId,
  }

  await fetch("http://localhost:5600/api/reservedseat/delete", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  });
  window.location.reload()
  newBooking();
}

async function increaseAttendees(type) {
  let booking = getStorage("booking");
  if (type === "adult") {
    booking.adults++;
  } else if (type === "child") {
    booking.children++;
  } else {
    booking.seniors++;
  }
  setStorage("booking", booking);
  newBooking();
}

async function reduceAttendees(type) {
  let booking = getStorage("booking");
  console.log(booking);
  if (type === "adult") {
    if (booking.adults > 0) {
      booking.adults--;
    }
  } else if (type === "child") {
    if (booking.children > 0) {
      booking.children--;
    }
  } else {
    if (booking.seniors > 0) {
      booking.seniors--;
    }
  }
  setStorage("booking", booking);
  newBooking();
}

async function newBooking() {
  let theaterScreening = document.querySelector(".new_booking");
  let screening = getStorage("screening");
  console.log(screening);
  window.addEventListener('resize', newBooking);

  let booking = getStorage("booking");
  if (isSavedSession()) {
    let user = JSON.parse(atob(getSavedSession()))
    if (booking.bookingId === '') {
      booking.userId = user.userId;
      booking.bookingId = randomId() + '-' + booking.userId + '-' + randomId();
    }
  }

  console.log(booking);

  setStorage("booking", booking);
  let timeArray = screening.time.split(":");
  let hr = timeArray[0];
  let min = timeArray[1];

  let html = `
  <div class="new_booking_header">
    <h1>${screening.title}</h1>
    
    <h2>Total price: ${getTotal()} SEK</h2>
  </div>
  <div class="new-_booking__header">
    <h3>${hr}:${min}</h1>
    <p>${screening.date} | ${screening.name}</p>
  </div>

    <div class="ticket_seat_selection">
      <div class="ticket_selection">
      <ul>
            <li class="ticket">
              <h1>Child</h1>
              <button onclick={reduceAttendees("child")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("child")} class="ticket_button_more">+</button>
              <h1>${booking.children}</h1>
            </li>
            <li class="ticket">
              <h1>Adult</h1>
              <button onclick={reduceAttendees("adult")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("adult")} class="ticket_button_more">+</button>
              <h1>${booking.adults}</h1>
            </li>
            <li class="ticket">
              <h1>Senior</h1>
              <button onclick={reduceAttendees("senior")} class="ticket_button_less">-</button>
              <button onclick={increaseAttendees("senior")} class="ticket_button_more">+</button>
              <h1>${booking.seniors}</h1>
            </li>
          </ul>
          <button>Confirm Booking</button>
      </div>
      <div class="seats_container">
      <svg version="1.1" viewBox="0 0 500 600" 
            preserveAspectRatio="xMinYMin meet"" class="svg-content">
            `;

  let allReservations = await (await fetch('http://localhost:5600/api/reservedseat/screening/' + screening.screeningId)).json();

  let sizing = 0;
  let columnSize = (500) / (screening.mainColumns * 2);
  let rowSize = (500) / (screening.mainRows * 2)
  if (columnSize > rowSize) {
    sizing = rowSize;
  } else {
    sizing = columnSize;
  }
  count = 1;
  let y_pos = 25;
  console.log(count);
  for (let row = 0; row < screening.mainRows; row++) {
    let x_pos = 20
    for (let column = 0; column < screening.mainColumns; column++) {
      console.log(allReservations.length)
      let found = false;

      for (let i = 0; i < allReservations.length; i++) {
        let reservation = allReservations[i];
        if (reservation.isTemp === 1) {
          let now = Date.now();
          if (reservation.dateTime + (1000 * 60) * 5 < now) {
            const reqBody = {
              "seatId": reservation.seatId,
              "screeningId": screening.screeningId
            }

            const response = await fetch("http://localhost:5600/api/screenings/removeSeatReservation", {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(reqBody)
            });

            await fetch('http://localhost:5600/api/bookings/' + reservation.bookingId, {
              method: 'DELETE'
            });
          }
        }
        console.log(reservation.seatId)
        if (reservation.seatId === count) {
          console.log("inside reservation.seatid === count")
          if (reservation.bookingId != booking.bookingId) {
            html += `<rect fill="grey" x="${x_pos}" height="${sizing}" y="${y_pos}"
            width="${sizing}" rx="4" />`
            found = true
            break;
          } else {
            console.log("inside user seatarray")
            html += `<rect fill="blue" x="${x_pos}" height="${sizing}" y="${y_pos}"
            width="${sizing}" rx="4" onclick="unreserveSeat(${count})"/>`
            found = true
            break;
          }
        }
      }
      if (!found) {
        html += `<rect fill="rgb(255, 225, 0)" x="${x_pos}" height="${sizing}" y="${y_pos}"
          width="${sizing}" rx="4" onclick="reserveSeat(${count})"/>`;
      }
      found = false;
      x_pos += sizing * 2
      count++;
    }
    y_pos += sizing * 2;
  }

  html += `
      </svg>
    </div>
  </div>`

  theaterScreening.innerHTML = html;
}
