<?php
header('Content-Type: application/json');

require_once 'FormHandler.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Alleen POST requests zijn toegestaan']);
    exit;
}

$formHandler = new FormHandler();

if ($formHandler->validate($_POST)) {
    if ($formHandler->save()) {
        echo json_encode($formHandler->getResponse());
    } else {
        echo json_encode([
            'success' => false,
            'errors' => $formHandler->getErrors()
        ]);
    }
} else {
    echo json_encode($formHandler->getResponse());
}
?>
