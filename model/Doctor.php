<?php
class Doctor {
    private $id;
    private $name;
    private $specialty;
    private $location;
    private $phoneNum;
    private $email;
    private $password;

    public function setId($id) {
        $this->id = $id;
    }    
    
    public function getId() {
        return $this->id;
    }
    
    public function setName($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function setSpecialty($specialty) {
        $this->specialty = $specialty;
    }

    public function getSpecialty() {
        return $this->specialty;
    }
    
    public function setLocation($location) {
        $this->location = $location;
    }

    public function getLocation() {
        return $this->location;
    }

    public function setPhoneNum($phoneNum) {
        $this->phoneNum = $phoneNum;
    }

    public function getPhoneNum() {
        return $this->phoneNum;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getEmail() {
        return $this->name;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public function getPassword() {
        return $this->password;
    }
}