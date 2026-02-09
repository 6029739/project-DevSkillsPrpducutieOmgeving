// Wacht tot de pagina volledig geladen is
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletterForm');
    const inputs = form.querySelectorAll('input[required]');
    const checkbox = document.getElementById('akkoord');
    
    // Functie om een error message te tonen
    function showError(input, message) {
        const errorSpan = input.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        input.style.borderColor = '#060505ff';
    }
    
    // Functie om error message te verbergen
    function hideError(input) {
        const errorSpan = input.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        input.style.borderColor = '#C0C0C0';
    }
    
    // Validatie functie voor individuele velden
    function validateField(input) {
        const value = input.value.trim();
        
        // Checkbox validatie
        if (input.type === 'checkbox') {
            if (!input.checked) {
                showError(input, 'U moet akkoord gaan met de voorwaarden');
                return false;
            } else {
                hideError(input);
                return true;
            }
        }
        
        // Lege velden (behalve tussenvoegsel)
        if (input.hasAttribute('required') && value === '') {
            showError(input, 'Dit veld is verplicht');
            return false;
        }
        
        // Email validatie
        if (input.type === 'email' && value !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showError(input, 'Voer een geldig e-mailadres in');
                return false;
            }
        }
        
        // Postcode validatie (NL formaat: 1234AB)
        if (input.id === 'postcode' && value !== '') {
            // Zet postcode om naar hoofdletters
            input.value = value.toUpperCase();
            const postcodePattern = /^[0-9]{4}[A-Z]{2}$/;
            if (!postcodePattern.test(input.value)) {
                showError(input, 'Voer een geldige postcode in (bijv. 1234AB)');
                return false;
            }
        }
        
        // Telefoonnummer validatie (basis check)
        if (input.type === 'tel' && value !== '') {
            const phonePattern = /^[0-9\s\-\+\(\)]+$/;
            if (!phonePattern.test(value) || value.replace(/\D/g, '').length < 10) {
                showError(input, 'Voer een geldig telefoonnummer in');
                return false;
            }
        }
        
        // Geboortedatum validatie (moet in het verleden liggen)
        if (input.type === 'date' && value !== '') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate >= today) {
                showError(input, 'Geboortedatum moet in het verleden liggen');
                return false;
            }
        }
        
        // Als alles goed is, verberg error
        hideError(input);
        return true;
    }
    
    // Real-time validatie bij input
    inputs.forEach(input => {
        // Bij blur (wanneer gebruiker veld verlaat)
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        // Bij input (terwijl gebruiker typt) - alleen voor checkbox
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                validateField(input);
            });
        }
    });
    
    // Postcode automatisch omzetten naar hoofdletters
    const postcodeInput = document.getElementById('postcode');
    postcodeInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            const formData = new FormData(form);
            
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'process.php', true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    
                    if (response.success) {
                        alert(response.message);
                        form.reset();
                    } else {
                        if (response.errors) {
                            let errorMessage = 'Er zijn fouten gevonden:\n';
                            for (let field in response.errors) {
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
        } else {
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
