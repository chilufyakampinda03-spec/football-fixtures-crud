const API_URL = 'https://football-fixtures-crud.onrender.com/api/sports';
const sportForm = document.getElementById('sportForm');
const sportTableBody = document.getElementById('sportTableBody');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const recordIdInput = document.getElementById('recordId');
const playerNameInput = document.getElementById('player_name');
const positionInput = document.getElementById('position');
const jerseyNumberInput = document.getElementById('jersey_number');

async function fetchRecords() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        sportTableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = 
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="actions">
                    <button class="btn-warning" onclick="editRecord(, '', '', '')">Edit</button>
                    <button class="btn-danger" onclick="deleteRecord()">Delete</button>
                </td>
            ;
            sportTableBody.appendChild(row);
        });
    } catch (error) { console.error('Error fetching records:', error); }
}

sportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = recordIdInput.value;
    const payload = {
        player_name: playerNameInput.value,
        position: positionInput.value,
        jersey_number: jerseyNumberInput.value ? parseInt(jerseyNumberInput.value) : null
    };
    try {
        if (id) {
            await fetch(${API_URL}/, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
            await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        resetForm();
        fetchRecords();
    } catch (error) { console.error('Error saving record:', error); }
});

function editRecord(id, name, position, jersey) {
    recordIdInput.value = id;
    playerNameInput.value = name;
    positionInput.value = position;
    jerseyNumberInput.value = jersey;
    formTitle.innerText = Edit Record #;
    submitBtn.innerText = 'Update Record';
    cancelBtn.style.display = 'inline-block';
}

async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await fetch(${API_URL}/, { method: 'DELETE' });
            fetchRecords();
        } catch (error) { console.error('Error deleting record:', error); }
    }
}

function resetForm() {
    recordIdInput.value = '';
    sportForm.reset();
    formTitle.innerText = 'Add New Record';
    submitBtn.innerText = 'Save Record';
    cancelBtn.style.display = 'none';
}

fetchRecords();
