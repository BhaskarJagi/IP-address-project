const address = document.getElementById("address");
const getBtn = document.getElementById("get-btn");
const userDetails = document.getElementById("user-details");
const filterBar = document.getElementById("filter-bar");

getBtn.addEventListener("click", () => {
  userDetails.style.display = "block";
  getBtn.style.display = "none";
});

filterBar.addEventListener("input", () => filterPostOffices());

fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    ip = data.ip;
    address.innerText += ` ${ip}`;

    fetch(`https://ipapi.co/${ip}/json/`)
      .then((response) => response.json())
      .then((data) => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const city = data.city;
        const region = data.region;
        const org = data.org;
        const hostname = location.host;
        const timezone = data.timezone;
        const pincode = data.postal;
        document.getElementsByClassName(
          "details"
        )[0].textContent += ` ${latitude}`;
        document.getElementsByClassName(
          "details"
        )[1].textContent += ` ${longitude}`;
        document.getElementsByClassName("details")[2].textContent += ` ${city}`;
        document.getElementsByClassName("details")[3].textContent += ` ${region}`;
        document.getElementsByClassName("details")[4].textContent += ` ${org}`;
        document.getElementsByClassName("details")[5].textContent += ` ${hostname}`;

        const currentTime = new Date().toLocaleString("en-US", {timeZone: timezone,});

        document.getElementsByClassName("details")[6].textContent += ` ${timezone}`;
        document.getElementsByClassName("details")[7].textContent += ` ${currentTime}`;
        document.getElementsByClassName("details")[8].textContent += ` ${pincode}`;

        showLocationOnMap(latitude, longitude);
        showPostOffices(pincode);
      })
      .catch((error) => {
        console.error('Error:',error);
      })
  })
  .catch((error) => {
    console.error('Error:',error);
  })

function showLocationOnMap(latitude, longitude) {
  document.getElementById("user-location").innerHTML = `<iframe src="https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed" width="100%" height="100%"></iframe>`;
}

function showPostOffices(pincode) {
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].Message;
      document.getElementsByClassName("details")[9].textContent += ` ${postOffices}`;

      listOfPostOffices(data[0].PostOffice);
      filterPostOffices(data[0].PostOffice);
    })
    .catch(error => {
        console.error('Error:',error);
    })
}

function listOfPostOffices(arr) {
  arr.forEach((element) => {
    document.getElementById(
      "postOffices-list"
    ).innerHTML += `<div id="postOffice">
            <p>Name:   ${element.Name}</p>
            <p>Branch Type:   ${element.BranchType}</p>
            <p>Delivery Status:   ${element.DeliveryStatus}</p>
            <p>District:   ${element.District}</p>
            <p>Division:   ${element.Division}</p>
        </div>`;
  });
}

function filterPostOffices() {
  const filter = filterBar.value.toUpperCase();

  const postOfficeList = document.getElementById("postOffices-list");

  const listItems = postOfficeList.getElementsByTagName("div");

  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];

    const text = listItem.textContent || listItem.innerText;
    if (text.toUpperCase().indexOf(filter) > -1) {
      listItem.style.display = "";
    } else {
      listItem.style.display = "none";
    }
  }
}
