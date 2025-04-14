const API_URL = "http://localhost:5000"; // Backend URL

// Function to search nearby hospitals based on symptoms
function searchHospitals() {
  const symptoms = document.getElementById("symptoms").value;

  if (!symptoms) {
    alert("Please enter your symptoms.");
    return;
  }

  axios.post(`${API_URL}/api/search-hospitals`, { symptoms })
    .then(response => {
      const hospitals = response.data.hospitals;
      displayHospitals(hospitals);
    })
    .catch(error => {
      console.error("Error searching hospitals:", error);
    });
}

// Display the list of hospitals
function displayHospitals(hospitals) {
  const hospitalList = document.getElementById("hospital-list");
  hospitalList.innerHTML = ""; // Clear previous results

  if (hospitals.length === 0) {
    hospitalList.innerHTML = "<p>No hospitals found based on your symptoms.</p>";
    return;
  }

  const ul = document.createElement("ul");
  hospitals.forEach(hospital => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${hospital.name}</strong><br>
      Address: ${hospital.address}<br>
      Specialties: ${hospital.specialties.join(", ")}<br>
      <button onclick="selectHospital('${hospital._id}', '${hospital.name}')">Book Appointment</button>
    `;
    ul.appendChild(li);
  });
  hospitalList.appendChild(ul);
}

// Select a hospital for booking an appointment
function selectHospital(hospitalId, hospitalName) {
  document.getElementById("appointment-section").style.display = "block";
  document.getElementById("appointment-section").setAttribute("data-hospital-id", hospitalId);
  document.getElementById("appointment-section").setAttribute("data-hospital-name", hospitalName);
}

// Function to book an appointment
function bookAppointment() {
  const userName = document.getElementById("user-name").value;
  const appointmentTime = document.getElementById("appointment-time").value;
  const hospitalId = document.getElementById("appointment-section").getAttribute("data-hospital-id");

  if (!userName || !appointmentTime) {
    alert("Please fill in all fields.");
    return;
  }

  const appointmentData = {
    hospitalId,
    userName,
    time: appointmentTime
  };

  axios.post(`${API_URL}/api/book-appointment`, appointmentData)
    .then(response => {
      alert("Appointment booked successfully!");
      document.getElementById("user-name").value = "";
      document.getElementById("appointment-time").value = "";
      document.getElementById("appointment-section").style.display = "none";
    })
    .catch(error => {
      console.error("Error booking appointment:", error);
    });
}
