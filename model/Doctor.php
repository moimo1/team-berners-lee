<?php
class Doctor {
    private $id;
    private $name;
    private $specialty;
    private $location;
    private $phoneNum;
    private $email;
    private $password;

    public function __construct($id) {
        $this->id = $id;
    }    
    
    public function getId() {
        return $this->id;
    }
    
    public function __construct($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function __construct($specialty) {
        $this->specialty = $specialty;
    }

    public function getSpecialty() {
        return $this->specialty;
    }
    
    public function __construct($location) {
        $this->location = $location;
    }

    public function getLocation() {
        return $this->location;
    }

    public function __construct($phoneNum) {
        $this->phoneNum = $phoneNum;
    }

    public function getPhoneNum() {
        return $this->phoneNum;
    }

    public function __construct($email) {
        $this->email = $email;
    }

    public function getEmail() {
        return $this->name;
    }

    public function __construct($password) {
        $this->password = $password;
    }

    public function getPassword() {
        return $this->password;
    }
}