// Hospital and Doctor Search Functionality
async function searchHospitals(city) {
    try {
        const hospitals = await api.hospitals.getByCity(city);
        return hospitals;
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
    }
}

async function searchDoctors(hospitalId) {
    try {
        const doctors = await api.doctors.getByHospital(hospitalId);
        return doctors;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}

function renderHospitals(hospitals, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!hospitals.length) {
        container.innerHTML = '<p>No hospitals found in this city.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'hospital-list';

    hospitals.forEach(hospital => {
        const card = document.createElement('div');
        card.className = 'hospital-card';
        card.innerHTML = `
            <h3>${hospital.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${hospital.address}</p>
            <p><i class="fas fa-phone"></i> ${hospital.contact}</p>
            <button onclick="loadDoctors('${hospital._id}')" class="view-doctors-btn">
                View Doctors
            </button>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);
}

function renderDoctors(doctors, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!doctors.length) {
        container.innerHTML = '<p>No doctors available in this hospital.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'doctor-list';

    doctors.forEach(doctor => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
            <h3>Dr. ${doctor.name}</h3>
            <p><i class="fas fa-stethoscope"></i> ${doctor.specialization}</p>
            <p><i class="fas fa-clock"></i> ${doctor.timing}</p>
            <p><i class="fas fa-phone"></i> ${doctor.contact}</p>
            <button onclick="bookAppointment('${doctor._id}')" class="book-appointment-btn">
                Book Appointment
            </button>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);
}

// Event handler for city search
async function handleCitySearch(event) {
    event.preventDefault();
    const cityInput = document.getElementById('citySearch');
    const resultsContainer = document.getElementById('searchResults');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        loadingMessage.style.display = 'block';
        const hospitals = await searchHospitals(cityInput.value);
        renderHospitals(hospitals, 'searchResults');
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                Error searching hospitals: ${error.message}
            </div>
        `;
    } finally {
        loadingMessage.style.display = 'none';
    }
}

// Event handler for loading doctors
async function loadDoctors(hospitalId) {
    const resultsContainer = document.getElementById('doctorResults');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        loadingMessage.style.display = 'block';
        const doctors = await searchDoctors(hospitalId);
        renderDoctors(doctors, 'doctorResults');
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                Error loading doctors: ${error.message}
            </div>
        `;
    } finally {
        loadingMessage.style.display = 'none';
    }
}

// Initialize the search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleCitySearch);
    }
});
