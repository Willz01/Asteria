async function loadBookingsToTable() {


  let userObject = JSON.parse(atob(getSavedSession()));
  let userID = userObject.userId
  console.log(userID);
  let data = await (await fetch(`http://127.0.0.1:5600/api/users/${userID}/bookings-info`)).json()

  if (data.length === 0) {
    document.querySelector('.view_booking_container').innerHTML += 'No bookings';
  } else {
    console.log(data[0].bookingId);
    let currentBookingId = data[0].bookingId;
    let html = "";
    let pasthtml = "";
    // console.log(currentBookingId + "hello")
    let counter = 0;
    let day = new Date();
    let month = new Date(); // jan = 0
    let currentday = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    let m = new Date();
    console.log(currentday, currentMonth + " checking date");
    for (let booking of data) {

      day = new Date(booking.date).getDate();
      month = new Date(booking.date).getMonth() + 1;
      console.log(day, month + "loop date");
      if (month > currentMonth || month === currentMonth && day >= currentday) {
        //   if (booking.date > m) {
        if (counter === 0) {
          html += ` <tbody> <tr>
        <td><button id="${booking.bookingId}" onclick="deleteBooking(id)">delete</button></td>
        <td>${booking.title}</td >
        <td>${booking.theaterName}</td>
        <td>${booking.time}</td>
        <td>${booking.date}</td>
        <td>${booking.adults}</td>
        <td>${booking.children}</td>
        <td>${booking.seniors}</td>
        <td>${booking.reservedSeat}`;
          console.log(counter + "in the loop")
        } else {
          if (currentBookingId === booking.bookingId) {
            html += ` ,${booking.reservedSeat}`;
            console.log(currentBookingId + "if there is another seatt :  " + counter)
          } else {
            console.log(currentBookingId + "else there is another seatt :" + counter)
            html += `</td> 
        </tr> `;
            if (counter != 0) {
              html += ` <tbody> <tr>
        <td><button id="${booking.bookingId}" onclick="deleteBooking(id)">delete</button></td>
        <td>${booking.title}</td >
        <td>${booking.theaterName}</td>
        <td>${booking.time}</td>
        <td>${booking.date}</td>
        <td>${booking.adults}</td>
        <td>${booking.children}</td>
        <td>${booking.seniors}</td>
        <td>${booking.reservedSeat}`;
              console.log(currentBookingId + "if statment for counr!=0" + counter)
              currentBookingId = booking.bookingId;
            }
          }
        }
      } else {
        if (counter === 0) {
          pasthtml += ` <tbody>
          <tr id="graybooking">
        <td></td> 
        <td>${booking.title}</td >
        <td>${booking.theaterName}</td>
        <td>${booking.time}</td>
        <td>${booking.date}</td>
        <td>${booking.adults}</td>
        <td>${booking.children}</td>
        <td>${booking.seniors}</td>
        <td>${booking.reservedSeat}`;
          console.log(counter + "in the loop")
        } else {
          if (currentBookingId === booking.bookingId) {
            pasthtml += ` ,${booking.reservedSeat}`;
            console.log(currentBookingId + "if there is another seatt :  " + counter)
          } else {
            console.log(currentBookingId + "else there is another seatt :" + counter)
            pasthtml += `</td>
          
        </td> `;
            if (counter != 0) {
              pasthtml += `<tr id="graybooking">
            <td></td>
        <td>${booking.title}</td >
        <td>${booking.theaterName}</td>
        <td>${booking.time}</td>
        <td>${booking.date}</td>
        <td>${booking.adults}</td>
        <td>${booking.children}</td>
        <td>${booking.seniors}</td>
        <td>${booking.reservedSeat}`;
              console.log(currentBookingId + "if statment for counr!=0" + counter)
              currentBookingId = booking.bookingId;
            }
          }
        }
      }

      counter = counter + 1
      console.log(booking)

    }
    pasthtml += `</tbody>`;
    document.querySelector('.view_booking_container').innerHTML += html;
    document.querySelector('.view_booking_container').innerHTML += pasthtml;
    console.log(counter);
    console.log(document.querySelector('.view_booking_container'));
    document.querySelector('.view_booking_container').addEventListener('click', (event) => {

      console.log(event)
    })
  }


}


async function deleteBooking(id) {
  // delete booking and research sets associated
  let changes = await (await fetch(`http://127.0.0.1:5600/api/bookings/${id}`, { method: 'DELETE' })).json()
  console.log(changes);
  console.log(id)
  window.location.href = '/bookings'
}
