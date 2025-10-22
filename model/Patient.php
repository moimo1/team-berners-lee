<?php
class Client {
    private $db;
    private $name;
    private $birthdate;
    private $address;
    private $email;
    private $password;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getName() {
        return $this->name;
    }

    public function getBirthdate() {
        return $this->birthdate;
    }

    public function getAddress() {
        return $this->address;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setName($name) {
        $this->name = $name;
    }
    
    public function setBirthdate($birthdate) {
        $this->birthdate = $birthdate;
    }

    public function setAddress($address) {
        $this->address = $address;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setPassword($password) {
        $this->password = $password;
    }
}