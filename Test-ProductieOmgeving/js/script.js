
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletterForm');
    const successMessage = document.getElementById('success-message');

   
    function validateField(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + '-error');
        let isValid = true;
        let errorMessage = '';

      
        field.classList.remove('error');

        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Dit veld is verplicht';
        }

    
        if (fieldId === 'postcode' && field.value.trim()) {
            const postcodePattern = /^[0-9]{4}[A-Za-z]{2}$/;
            if (!postcodePattern.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Voer een geldige postcode in (bijvoorbeeld: 1234AB)';
            }
        }

        // Specifieke validatie voor telefoonnummer
        if (fieldId === 'telefoonnummer' && field.value.trim()) {
            // Nederlandse telefoonnummers: 10 cijfers, kan beginnen met 0 of +31
            const phonePattern = /^(\+31|0)[1-9][0-9]{8}$/;
            const cleanedPhone = field.value.trim().replace(/[\s\-\(\)]/g, ''); // Verwijder spaties, streepjes en haakjes
            if (!phonePattern.test(cleanedPhone)) {
                isValid = false;
                errorMessage = 'Voer een geldig telefoonnummer in (bijvoorbeeld: 0612345678)';
            }
        }

        // Specifieke validatie voor e-mail
        if (fieldId === 'email' && field.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Voer een geldig e-mailadres in (bijvoorbeeld: naam@voorbeeld.nl)';
            }
        }

       
        if (fieldId === 'geboortedatum' && field.value) {
            const birthDate = new Date(field.value);
            const today = new Date();
            if (birthDate > today) {
                isValid = false;
                errorMessage = 'Geboortedatum kan niet in de toekomst liggen';
            }
        }

       
        if (fieldId === 'akkoord' && field.hasAttribute('required')) {
            if (!field.checked) {
                isValid = false;
                errorMessage = 'U moet akkoord gaan met de voorwaarden';
            }
        }

     
        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            errorElement.textContent = '';
        }

        return isValid;
    }

  
    const requiredFields = form.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(field);
        });
    });


    const postcodeField = document.getElementById('postcode');
    postcodeField.addEventListener('input', function() {
        
        this.value = this.value.toUpperCase();
        if (this.value.trim()) {
            validateField(this);
        }
    });

    // Valideer telefoonnummer bij input (real-time)
    const telefoonnummerField = document.getElementById('telefoonnummer');
    telefoonnummerField.addEventListener('input', function() {
        // Verwijder spaties, streepjes en haakjes voor validatie
        if (this.value.trim()) {
            validateField(this);
        }
    });

    // Valideer e-mail bij input (real-time)
    const emailField = document.getElementById('email');
    emailField.addEventListener('input', function() {
        if (this.value.trim()) {
            validateField(this);
        }
    });

   
    const akkoordCheckbox = document.getElementById('akkoord');
    akkoordCheckbox.addEventListener('change', function() {
        validateField(this);
    });

    
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

     
        if (postcodeField.value.trim() && !validateField(postcodeField)) {
            isFormValid = false;
        }

        // Valideer telefoonnummer als deze is ingevuld
        if (telefoonnummerField.value.trim() && !validateField(telefoonnummerField)) {
            isFormValid = false;
        }

        // Valideer e-mail als deze is ingevuld
        if (emailField.value.trim() && !validateField(emailField)) {
            isFormValid = false;
        }

        
        if (isFormValid) {
           
            form.style.display = 'none';
            
            
            successMessage.style.display = 'block';

            console.log('Formulier data:', {
                voornaam: document.getElementById('voornaam').value,
                tussenvoegsel: document.getElementById('tussenvoegsel').value,
                achternaam: document.getElementById('achternaam').value,
                geboortedatum: document.getElementById('geboortedatum').value,
                straatnaam: document.getElementById('straatnaam').value,
                postcode: document.getElementById('postcode').value,
                woonplaats: document.getElementById('woonplaats').value,
                telefoonnummer: document.getElementById('telefoonnummer').value,
                email: document.getElementById('email').value,
                akkoord: document.getElementById('akkoord').checked
            });
        } else {
            
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
});
