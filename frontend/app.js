const API_URL = 'https://football-fixtures-crud.onrender.com/api/sports';

// Fetch and display all records on load
async function loadSports() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const tbody = document.getElementById('sportsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.player_name || ''}</td>
                    <td>${item.position || ''}</td>
                    <td>${item.jersey_number || ''}</td>
                    <td>
                        <button onclick="editRecord(${item.id}, '${item.player_name}', '${item.position}', ${item.jersey_number})">Edit</button>
                        <button onclick="deleteRecord(${item.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading records:', error);
    }
}

// Handle Form Submission (Create or Update)
const form = document.getElementById('sportsForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('recordId').value;
        const player_name = document.getElementById('playerName').value;
        const position = document.getElementById('position').value;
        const jersey_number = document.getElementById('jersey_number').value;

        const payload = { player_name, position, jersey_number: jersey_number ? parseInt(jersey_number) : null };

        if (id) {
            // Update existing record (PUT)
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create new record (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        form.reset();
        document.getElementById('recordId').value = '';
        loadSports();
    });
}

// Fill form for editing
function editRecord(id, name, pos, jersey) {
    document.getElementById('recordId').value = id;
    document.getElementById('playerName').value = name;
    document.getElementById('position').value = pos;
    document.getElementById('jersey_number').value = jersey;
}

// Delete a record (DELETE)
async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadSports();
    }
}

// Load data when the page opens
loadSports();