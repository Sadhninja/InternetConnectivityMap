function submitForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwg2ca-4gvw3v6xxfN8f_OoXO-DwuiWxWCRuiOH4YVh8G4OlDfavusrwYSIvCsNakJPiA/exec", true); // Replace with your deployed URL
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Show loading status
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<div id='loading-spinner'></div><p>Loading, please wait...</p>";


    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                resultDiv.innerHTML = "<p>Login successful!</p>";
                document.getElementById('login-form').style.display = 'none'; // Hide the login form
                document.getElementById('map').style.display = 'block'; // Show the map

                if (typeof map !== 'undefined') {
                    map.invalidateSize();
                }
            } else {
                resultDiv.innerHTML = "<p>Invalid username or password.</p>";
            }
        }
    };

    xhr.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
}
