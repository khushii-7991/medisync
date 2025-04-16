// Prescription and Schedule Management

// Status emojis for medicine tracking
const STATUS_EMOJIS = {
    taken: '✅',
    skipped: '❌',
    partial: '⚠️'
};

// Fetch and render prescription details
async function loadPrescription(prescriptionId) {
    try {
        const schedule = await api.schedule.getByPrescriptionId(prescriptionId);
        renderSchedule(schedule);
    } catch (error) {
        console.error('Error loading prescription:', error);
        document.getElementById('scheduleContainer').innerHTML = `
            <div class="error-message">
                Error loading prescription: ${error.message}
            </div>
        `;
    }
}

// Render the 30-day schedule
function renderSchedule(schedule) {
    const container = document.getElementById('scheduleContainer');
    container.innerHTML = '';

    const calendar = document.createElement('div');
    calendar.className = 'medicine-calendar';

    // Group schedule by date
    const scheduleByDate = groupScheduleByDate(schedule);

    // Create calendar header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <h2>Medicine Schedule</h2>
        <div class="legend">
            <span>${STATUS_EMOJIS.taken} Taken</span>
            <span>${STATUS_EMOJIS.partial} Partial</span>
            <span>${STATUS_EMOJIS.skipped} Skipped</span>
        </div>
    `;
    calendar.appendChild(header);

    // Create calendar grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    Object.entries(scheduleByDate).forEach(([date, medicines]) => {
        const dayCard = createDayCard(date, medicines);
        grid.appendChild(dayCard);
    });

    calendar.appendChild(grid);
    container.appendChild(calendar);
}

// Create a card for each day's medicines
function createDayCard(date, medicines) {
    const card = document.createElement('div');
    card.className = 'day-card';
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    const medicineList = medicines.map(medicine => `
        <div class="medicine-item" data-id="${medicine._id}">
            <span class="medicine-name">${medicine.name}</span>
            <span class="medicine-time">${medicine.time}</span>
            <div class="status-controls">
                <button onclick="updateMedicineStatus('${medicine._id}', 'taken')" 
                        class="status-btn ${medicine.status === 'taken' ? 'active' : ''}">
                    ${STATUS_EMOJIS.taken}
                </button>
                <button onclick="updateMedicineStatus('${medicine._id}', 'partial')"
                        class="status-btn ${medicine.status === 'partial' ? 'active' : ''}">
                    ${STATUS_EMOJIS.partial}
                </button>
                <button onclick="updateMedicineStatus('${medicine._id}', 'skipped')"
                        class="status-btn ${medicine.status === 'skipped' ? 'active' : ''}">
                    ${STATUS_EMOJIS.skipped}
                </button>
            </div>
        </div>
    `).join('');

    card.innerHTML = `
        <div class="date-header">${formattedDate}</div>
        <div class="medicines">
            ${medicineList}
        </div>
    `;

    return card;
}

// Update medicine status
async function updateMedicineStatus(medicineId, status) {
    try {
        await api.schedule.updateStatus({
            medicineId,
            status
        });

        // Update UI
        const medicineItem = document.querySelector(`[data-id="${medicineId}"]`);
        if (medicineItem) {
            const buttons = medicineItem.querySelectorAll('.status-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            const activeButton = medicineItem.querySelector(`[onclick*="${status}"]`);
            if (activeButton) activeButton.classList.add('active');
        }
    } catch (error) {
        console.error('Error updating medicine status:', error);
        alert('Failed to update medicine status. Please try again.');
    }
}

// Helper function to group schedule by date
function groupScheduleByDate(schedule) {
    return schedule.reduce((acc, medicine) => {
        const date = medicine.date.split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(medicine);
        return acc;
    }, {});
}

// Initialize prescription view
document.addEventListener('DOMContentLoaded', () => {
    const prescriptionId = new URLSearchParams(window.location.search).get('id');
    if (prescriptionId) {
        loadPrescription(prescriptionId);
    }
});
