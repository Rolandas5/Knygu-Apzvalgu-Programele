// json-server – yra skirta sukurti netikrą API serverio prieigą. Galėsime pasiekti su GET, POST, PUT, PATCH, DELETE
// json-server --version – pasitikrinti ar yra instaliuotas json-server ir ar grąžina versiją
// json-server --watch path_iki_failo.json – paleidžia serverį ir nustato kelią iki failo kuris taps duomenų baze

const apiUrl = 'http://localhost:3000/students';

// GET – gražina duomenis iš API
async function getStudents() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Nepavyko gauti studentų sąrašo!');
    }

    const students = await response.json();
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';
    students.forEach((student) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>
          <button onclick="editStudent('${student.id}', '${student.name}', '${student.age}')">Redaguoti</button>
          <button onclick="deleteStudent('${student.id}')">Ištrinti</button>
        </td>
      `;
      studentList.append(row);
    });
  } catch (error) {
    console.error(error);
    alert('Klaida gaunant studentų sąrašą!');
  }
}

// POST – sukurti naują įrašą
document
  .getElementById('add-student-form')
  .addEventListener('submit', async (event) => {
    // preventDefault – neleidžia puslapiui persikrauti
    event.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      });

      if (!response.ok) {
        throw new Error('Nepavyko sukurti naujo studento!');
      }
    } catch (error) {
      console.error('Klaida kuriant naują studentą:', error);
      alert('Klaida kuriant naują studentą!');
    }

    getStudents();
  });

// PATCH – atnaujinti įrašą
async function editStudent(id, name, age) {
  const newName = prompt('Naujas vardas:', name);
  const newAge = prompt('Naujas amžius:', age);

  if (newName && newAge) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          age: Number(newAge),
        }),
      });

      if (!response.ok) {
        throw new Error('Nepavyko redaguoti studento!');
      }
    } catch (error) {
      console.error('Klaida redaguojant studentą:', error);
      alert('Klaida redaguojant studentą!');
    }

    getStudents();
  }
}

// DELETE – ištrinti įrašą
async function deleteStudent(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Nepavyko ištrinti studento!');
    }
  } catch (error) {
    console.error('Klaida ištrinant studentą:', error);
    alert('Klaida trinant studentą.');
  }

  getStudents();
}

getStudents();
