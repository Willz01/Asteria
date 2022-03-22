async function loadBookingsToTable() {


  console.log(atob(getSavedSession()));


  let data = await (await fetch('http://127.0.0.1:5600/api/users/2/bookings-info')).json()
  console.log(data[0].bookingId);
  let currentBookingId = data[0].bookingId;
  let html = "";
  // console.log(currentBookingId + "hello")
  let counter = 0;
  for (let booking of data) {
    if (counter === 0) {
      html += `
          <tr>     
          <th>${booking.title}</th >
          <th>${booking.theaterName}</th>
          <th>${booking.time}</th>
          <th>${booking.date}</th>
          <th>${booking.adults}</th>
          <th>${booking.children}</th>
          <th>${booking.seniors}</th>
          <th>${booking.reservedSeat} `;
      console.log(counter + "in the loop")
    } else {
      if (currentBookingId === booking.bookingId) {
        html += ` ,${booking.reservedSeat}`;
        console.log(currentBookingId + "if there is another seatt :  " + counter)
      } else {
        console.log(currentBookingId + "else there is another seatt :" + counter)
        html += `</th> 
        </tr> `;
        if (counter != 0) {
          html += `
          <tr>     
          <th>${booking.title}</th >
          <th>${booking.theaterName}</th>
          <th>${booking.time}</th>
          <th>${booking.date}</th>
          <th>${booking.adults}</th>
          <th>${booking.children}</th>
          <th>${booking.seniors}</th>
          <th>${booking.reservedSeat} `;
          console.log(currentBookingId + "if statment for counr!=0" + counter)
          currentBookingId = booking.bookingId;
        }
      }
    }

    counter = counter + 1
    console.log(booking)

  }
  document.querySelector('.view_booking_container').innerHTML += html;
  console.log(counter);
}