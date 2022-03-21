async function loadBookingsToTable() {


  console.log(atob(getSavedSession()));

  let data = await (await fetch('http://127.0.0.1:5600/api/users/2/bookings-info')).json()

  let html = "";

  for (let booking of data) {

    html += `

          <th>${booking.title}</th >
          <th>${booking.theaterName}</th>
          <th>${booking.reservedSeat}</th>
          <th>${booking.time}</th>
          <th>${booking.date}</th>
          <th>${booking.adults}</th>
          <th>${booking.children}</th>
          <th>${booking.seniors}</th>
      
    `;
    console.log(booking)
    document.querySelector('.view_booking_container').innerHTML += html;
  }
  console.log('dfdff')
}