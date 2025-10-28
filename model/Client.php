<?php
class Client {
    private $name;
    private $birthdate;
    private $address;
    private $email;
    private $password;
    

    public function __construct($name, $birthdate, $address, $email, $password) {
        $this->name = $name;
        $this->birthdate = $birthdate;
        $this->address = $address;
        $this->email = $email;
        $this->password = $password;
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