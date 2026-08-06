// INITIAL SELECTION OF ITEMS
const addCourseBtn = document.querySelector('.add-course-btn');
const calcBtn = document.querySelector('.calc-btn');
const courseContainer = document.querySelector('#course-container');

const totalCreditsDisplay = document.getElementById('total-credits');
const oldCgpaDisplay = document.getElementById('old-cgpa');
const calculatedCgpaDisplay = document.getElementById('calculated-cgpa');

// GRADE VALUES
const NSU_grades = {
    'A': 4.0, 'A-': 3.7, 
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 
    'D+': 1.3, 'D': 1.0, 'F': 0.0
};

// ADD COURSE BUTTON 
addCourseBtn.addEventListener('click', function() {
    const newRow = document.createElement('tr');
    newRow.className = 'curr-container';

    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control" placeholder="example: Mat350">
        </td>
        <td>
            <input type="number" class="form-control course-credits" placeholder="example: 3">
        </td>
        <td>
            <input type="text" class="form-control old-course-grade" placeholder="example: D">
        </td>
        <td>
            <input type="text" class="form-control retake-course-grade" placeholder="example: A">
        </td>
        <td>
            <button type="button" class="btn btn-outline-danger remove-btn shadow-sm">
                <i class="bi bi-trash3"></i>
            </button>
        </td>
    `;
    courseContainer.appendChild(newRow);
});

// REMOVE COURSE BUTTON
courseContainer.addEventListener('click', function (event) {
    // Check if the click target is the button or the icon inside the button
    if (event.target.classList.contains('remove-btn') || event.target.closest('.remove-btn')) {
        const allRows = document.querySelectorAll('.curr-container');

        if (allRows.length > 1) {
            const rowToRemove = event.target.closest('.curr-container');
            rowToRemove.remove();
        } else {
            alert('You must keep at least one course row.');
        }
    }
});

// CALCULATE BUTTON
calcBtn.addEventListener('click', function() {
    
    const prevCreditsInput = document.querySelector('#prev-credits');
    const prevCgpaInput = document.querySelector('#prev-cgpa');

    const prevCredits = parseFloat(prevCreditsInput.value) || 0;
    const prevCgpa = parseFloat(prevCgpaInput.value) || 0;

    if (prevCredits <= 0 || prevCgpa <= 0) {
        alert("Please enter valid current completed credits and current CGPA.");
        return;
    }
    
    let totalPoints = prevCredits * prevCgpa;
    const rows = document.querySelectorAll('.curr-container');
    let dynamicRowValidationError = false;
    
    rows.forEach(function (row) {
        const creditInput = row.querySelector('.course-credits');
        const oldGradeInput = row.querySelector('.old-course-grade');
        const newGradeInput = row.querySelector('.retake-course-grade');

        if (!creditInput.value.trim() || !oldGradeInput.value.trim() || !newGradeInput.value.trim()) {
            dynamicRowValidationError = true;
        }
    });

    if (dynamicRowValidationError) {
        alert("Please fill all credits, old grades, and new grades.");
        return; 
    }

    rows.forEach(function (row) {
        const creditInput = row.querySelector('.course-credits');
        const oldGradeInput = row.querySelector('.old-course-grade');
        const newGradeInput = row.querySelector('.retake-course-grade');

        const credits = parseFloat(creditInput.value);
        const oldGrade = oldGradeInput.value.toUpperCase().trim();
        const newGrade = newGradeInput.value.toUpperCase().trim();
        
        const oldPoints = NSU_grades[oldGrade];
        const newPoints = NSU_grades[newGrade];

        if (oldPoints !== undefined && newPoints !== undefined) {
            totalPoints = totalPoints - (oldPoints * credits) + (newPoints * credits);
        } else {
            alert(`One of the entered grades ("${oldGrade}" or "${newGrade}") is not recognized on the NSU scale.`);
            dynamicRowValidationError = true;
        }
    });

    if (dynamicRowValidationError) return;

    totalCreditsDisplay.innerText = prevCredits; 
    
    if (oldCgpaDisplay) {
        oldCgpaDisplay.innerText = prevCgpa.toFixed(2);
    }
    
    calculatedCgpaDisplay.innerText = (totalPoints / prevCredits).toFixed(2);
});