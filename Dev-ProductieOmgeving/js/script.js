
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
