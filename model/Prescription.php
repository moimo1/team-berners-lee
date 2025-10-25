<?php
class Prescription {
    private $db;
    private $prescID;
    private $doctorID;
    private $clientID;
    private $dateGiven;
    private $dateExpiry;

    public function getPrescID() {
        return $this->prescID;
    }

    public function setPrescID($prescID) {
        $this->prescID = $prescID;
    }

    public function getDoctorID() {
        return $this->doctorID;
    }

    public function setDoctorID($doctorID) {
        $this->doctorID = $doctorID;
    }

    public function getClientID() {
        return $this->clientID;
    }

    public function setClientID($clientID) {
        $this->clientID = $clientID;
    }

    public function getDateGiven() {
        return $this->dateGiven;
    }

    public function setDateGiven($dateGiven) {
        $this->dateGiven = $dateGiven;
    }

    public function getDateExpiry() {
        return $this->dateExpiry;
    }

    public function setDateExpiry($dateExpiry) {
        $this->dateExpiry = $dateExpiry;
    }
}