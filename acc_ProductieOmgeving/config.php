<?php
class Config {
    private static $host = 'localhost';
    private static $dbname = 'nieuwsbrief_acc';
    private static $username = 'test_user';
    private static $password = 'test_password123';
    
    public static function getHost() {
        return self::$host;
    }
    
    public static function getDbname() {
        return self::$dbname;
    }
    
    public static function getUsername() {
        return self::$username;
    }
    
    public static function getPassword() {
        return self::$password;
    }
}
?>
