// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Utility function for making API calls
async function fetchAPI(endpoint, options = {}) {
    try {
        const token = localStorage.getItem('token');
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth functions
const auth = {
    async login(email, password, userType) {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, userType })
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', userType);
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/login.html';
    }
};

// Hospital functions
const hospitals = {
    async getByCity(city) {
        return await fetchAPI(`/hospitals?city=${encodeURIComponent(city)}`);
    }
};

// Doctor functions
const doctors = {
    async getByHospital(hospitalId) {
        return await fetchAPI(`/doctors?hospital=${encodeURIComponent(hospitalId)}`);
    },

    async createPrescription(prescriptionData) {
        return await fetchAPI('/prescription', {
            method: 'POST',
            body: JSON.stringify(prescriptionData)
        });
    }
};

// Schedule functions
const schedule = {
    async getByPrescriptionId(prescriptionId) {
        return await fetchAPI(`/schedule/${prescriptionId}`);
    },

    async updateStatus(scheduleData) {
        return await fetchAPI('/schedule/update-status', {
            method: 'POST',
            body: JSON.stringify(scheduleData)
        });
    }
};

// Export the API functions
window.api = {
    auth,
    hospitals,
    doctors,
    schedule
};
