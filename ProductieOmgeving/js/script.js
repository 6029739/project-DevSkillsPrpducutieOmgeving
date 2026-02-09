document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('newsletterForm');
    var postcodeInput = document.getElementById('postcode');
    
    postcodeInput.oninput = function() {
        postcodeInput.value = postcodeInput.value.toUpperCase();
    };
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        var formData = new FormData(form);
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'process.php', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    alert(response.message);
                    form.reset();
                } else {
                    if (response.errors) {
                        var errorMessage = 'Er zijn fouten gevonden:\n';
                        for (var field in response.errors) {
                            errorMessage += response.errors[field] + '\n';
                        }
                        alert(errorMessage);
                    } else {
                        alert('Er is een fout opgetreden');
                    }
                }
            } else {
                alert('Er is een fout opgetreden bij het verzenden');
            }
        };
        
        xhr.onerror = function() {
            alert('Er is een fout opgetreden bij het verzenden');
        };
        
        xhr.send(formData);
    };
});
