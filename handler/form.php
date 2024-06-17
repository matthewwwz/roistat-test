<?php

$filename = 'form_responses.txt';

if (!empty($_POST)) {
    $record = [
        // перечисляются поля формы
        'name' => filter_input(INPUT_POST, 'name', FILTER_UNSAFE_RAW),
        'company_site' => filter_input(INPUT_POST, 'company_site', FILTER_UNSAFE_RAW),
        'phone' => filter_input(INPUT_POST, 'phone', FILTER_UNSAFE_RAW),
    ];

    $recordString = implode('; ', $record) . PHP_EOL; // склеить значения через точку с запятой

    file_put_contents($filename, $recordString, FILE_APPEND);
}