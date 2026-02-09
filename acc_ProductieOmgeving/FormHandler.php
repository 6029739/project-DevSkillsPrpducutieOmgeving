<?php
require_once 'Database.php';

class FormHandler {
    private $database;
    private $errors = [];
    private $data = [];
    
    public function __construct() {
        $this->database = new Database();
    }
    
    public function validate($postData) {
        $this->errors = [];
        $this->data = [];
        
        if (empty($postData['voornaam'])) {
            $this->errors['voornaam'] = 'Voornaam is verplicht';
        } else {
            $this->data['voornaam'] = $this->sanitize($postData['voornaam']);
        }
        
        if (!empty($postData['tussenvoegsel'])) {
            $this->data['tussenvoegsel'] = $this->sanitize($postData['tussenvoegsel']);
        } else {
            $this->data['tussenvoegsel'] = null;
        }
        
        if (empty($postData['achternaam'])) {
            $this->errors['achternaam'] = 'Achternaam is verplicht';
        } else {
            $this->data['achternaam'] = $this->sanitize($postData['achternaam']);
        }
        
        if (empty($postData['straatnaam'])) {
            $this->errors['straatnaam'] = 'Straatnaam is verplicht';
        } else {
            $this->data['straatnaam'] = $this->sanitize($postData['straatnaam']);
        }
        
        if (empty($postData['email'])) {
            $this->errors['email'] = 'Email is verplicht';
        } elseif (!filter_var($postData['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Ongeldig email adres';
        } else {
            $this->data['email'] = $this->sanitize($postData['email']);
        }
        
        if (empty($postData['postcode'])) {
            $this->errors['postcode'] = 'Postcode is verplicht';
        } else {
            $postcode = strtoupper(preg_replace('/\s+/', '', $postData['postcode']));
            if (!preg_match('/^[0-9]{4}[A-Z]{2}$/', $postcode)) {
                $this->errors['postcode'] = 'Ongeldige postcode';
            } else {
                $this->data['postcode'] = $postcode;
            }
        }
        
        if (empty($postData['woonplaats'])) {
            $this->errors['woonplaats'] = 'Woonplaats is verplicht';
        } else {
            $this->data['woonplaats'] = $this->sanitize($postData['woonplaats']);
        }
        
        if (empty($postData['telefoonnummer'])) {
            $this->errors['telefoonnummer'] = 'Telefoonnummer is verplicht';
        } else {
            $this->data['telefoonnummer'] = $this->sanitize($postData['telefoonnummer']);
        }
        
        if (empty($postData['geboortedatum'])) {
            $this->errors['geboortedatum'] = 'Geboortedatum is verplicht';
        } else {
            $this->data['geboortedatum'] = $postData['geboortedatum'];
        }
        
        if (empty($postData['akkoord'])) {
            $this->errors['akkoord'] = 'U moet akkoord gaan met de voorwaarden';
        } else {
            $this->data['akkoord'] = 1;
        }
        
        return empty($this->errors);
    }
    
    private function sanitize($input) {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }
    
    public function save() {
        try {
            $result = $this->database->insert('nieuwsbrief_aanmeldingen', $this->data);
            return $result;
        } catch (Exception $e) {
            $this->errors['database'] = 'Er is een fout opgetreden bij het opslaan';
            return false;
        }
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function getResponse() {
        if (empty($this->errors)) {
            return [
                'success' => true,
                'message' => 'Uw aanmelding is succesvol opgeslagen!'
            ];
        } else {
            return [
                'success' => false,
                'errors' => $this->errors
            ];
        }
    }
}
?>
