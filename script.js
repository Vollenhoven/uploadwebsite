// Function to save the uploaded data to local storage
function saveDataToStorage(imageUrl, text) {
    var existingData = localStorage.getItem('uploadedData');
    var newData = { imageUrl: imageUrl, text: text };

    if (existingData) {
        existingData = JSON.parse(existingData);
        existingData.push(newData);
        localStorage.setItem('uploadedData', JSON.stringify(existingData));
    } else {
        localStorage.setItem('uploadedData', JSON.stringify([newData]));
    }
}

// Function to load the uploaded data from local storage
function loadDataFromStorage() {
    var existingData = localStorage.getItem('uploadedData');

    if (existingData) {
        existingData = JSON.parse(existingData);
        for (var i = 0; i < existingData.length; i++) {
            var data = existingData[i];

            var container = document.createElement('div');
            container.className = 'uploaded-item';

            var image = document.createElement('img');
            image.src = data.imageUrl;
            image.className = 'uploaded-image';
            container.appendChild(image);

            var paragraph = document.createElement('p');
            paragraph.textContent = data.text;
            paragraph.className = 'uploaded-text';
            container.appendChild(paragraph);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            container.appendChild(deleteButton);

            // Check if the user is the administrator
            var isAdmin = true; // Set this flag according to your authentication logic

            deleteButton.addEventListener('click', function() {
                if (isAdmin || confirm('Are you sure you want to delete this item?')) {
                    var uploadedData = document.getElementById('uploaded-data');
                    uploadedData.removeChild(container);
                    removeDataFromStorage(data.imageUrl, data.text);
                }
            });

            var uploadedData = document.getElementById('uploaded-data');
            uploadedData.appendChild(container);
        }
    }
}

// Function to remove the uploaded data from local storage
function removeDataFromStorage(imageUrl, text) {
    var existingData = localStorage.getItem('uploadedData');

    if (existingData) {
        existingData = JSON.parse(existingData);
        existingData = existingData.filter(function(data) {
            return !(data.imageUrl === imageUrl && data.text === text);
        });
        localStorage.setItem('uploadedData', JSON.stringify(existingData));
    }
}

// Event listener for the form submission
document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the uploaded image and text
    var imageFile = document.getElementById('image-upload').files[0];
    var text = document.getElementById('text-input').value;

    // Create a new FileReader object
    var reader = new FileReader();

    // When the image is loaded
    reader.onload = function(event) {
        var imageUrl = event.target.result;

        // Save the uploaded data to local storage
        saveDataToStorage(imageUrl, text);

        // Create a new container div for each uploaded item
        var container = document.createElement('div');
        container.className = 'uploaded-item';

        // Create a new image element
        var image = document.createElement('img');
        image.src = imageUrl;
        image.className = 'uploaded-image';
        container.appendChild(image);

        // Create a new paragraph element for the text
        var paragraph = document.createElement('p');
        paragraph.textContent = text;
        paragraph.className = 'uploaded-text';
        container.appendChild(paragraph);

        // Create a delete button
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        container.appendChild(deleteButton);

        // Check if the user is the administrator
        var isAdmin = true; // Set this flag according to your authentication logic

        deleteButton.addEventListener('click', function() {
            if (isAdmin || confirm('Are you sure you want to delete this item?')) {
                var uploadedData = document.getElementById('uploaded-data');
                uploadedData.removeChild(container);
                removeDataFromStorage(imageUrl, text);
            }
        });

        var uploadedData = document.getElementById('uploaded-data');
        uploadedData.appendChild(container);
    };

    // Read the uploaded image as a data URL
    reader.readAsDataURL(imageFile);

    // Clear the input fields
    document.getElementById('image-upload').value = '';
    document.getElementById('text-input').value = '';
});

// Load the uploaded data from storage when the page loads
window.addEventListener('load', function() {
    loadDataFromStorage();
});
