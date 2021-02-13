<?php

// platform_check.php @generated by Composer

$issues = array();

if (!(PHP_VERSION_ID >= 70103)) {
    $issues[] = 'Your Composer dependencies require a PHP version ">= 7.1.3". You are running ' . PHP_VERSION  .  '.';
}

$missingExtensions = array();
extension_loaded('mbstring') || $missingExtensions[] = 'mbstring';
extension_loaded('simplexml') || $missingExtensions[] = 'simplexml';
extension_loaded('tokenizer') || $missingExtensions[] = 'tokenizer';
extension_loaded('xmlwriter') || $missingExtensions[] = 'xmlwriter';

if ($missingExtensions) {
    $issues[] = 'Your Composer dependencies require the following PHP extensions to be installed: ' . implode(', ', $missingExtensions);
}

if ($issues) {
    echo 'Composer detected issues in your platform:' . "\n\n" . implode("\n", $issues);
    exit(104);
}
