// Patient Dashboard Functions

// View Prescriptions
async function viewPrescriptions() {
    try {
        const userId = localStorage.getItem('userId');
        const prescriptions = await api.schedule.getByPrescriptionId(userId);
        
        if (prescriptions.length === 0) {
            showAlert('No prescriptions found.');
            return;
        }
        
        // Store prescriptions in localStorage for the prescription view page
        localStorage.setItem('currentPrescriptions', JSON.stringify(prescriptions));
        window.location.href = 'view_prescription.html';
    } catch (error) {
        showAlert('Error loading prescriptions: ' + error.message);
    }
}

// Book Appointment
async function bookAppointment() {
    try {
        // First, get the list of cities
        const cities = await api.hospitals.getCities();
        
        // Store cities in localStorage for the booking page
        localStorage.setItem('availableCities', JSON.stringify(cities));
        window.location.href = 'Book_Appointment.html';
    } catch (error) {
        showAlert('Error loading cities: ' + error.message);
    }
}

// Show Alert Message
function showAlert(message) {
    const alertContainer = document.getElementById('alertsContainer');
    const alertMessage = document.getElementById('alertMessage');
    
    alertMessage.textContent = message;
    alertContainer.classList.remove('hidden');
    
    // Hide alert after 5 seconds
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 5000);
}

// Update Welcome Message
function updateWelcome() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('welcomeHeading').textContent = `Welcome, ${userName}!`;
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateWelcome();
    
    // Check for any pending prescriptions or appointments
    checkNotifications();
});

// Check Notifications
async function checkNotifications() {
    try {
        const userId = localStorage.getItem('userId');
        
        // Get today's schedule
        const todaySchedule = await api.schedule.getTodaySchedule(userId);
        
        if (todaySchedule && todaySchedule.length > 0) {
            const pendingMeds = todaySchedule.filter(med => !med.status);
            if (pendingMeds.length > 0) {
                showAlert(`You have ${pendingMeds.length} pending medications for today.`);
            }
        }
        
        // Check upcoming appointments
        const appointments = await api.appointments.getUpcoming(userId);
        if (appointments && appointments.length > 0) {
            const nextAppointment = appointments[0];
            const date = new Date(nextAppointment.date).toLocaleDateString();
            showAlert(`Your next appointment is on ${date} with Dr. ${nextAppointment.doctorName}`);
        }
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
}
