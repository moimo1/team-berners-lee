<?php
class Medicine {
    private $db;
    private $id;
    private $name;
    private $brand;
    private $manufactureDate;
    private $expiryDate;
    private $amount;
    private $description;

    public function __construct($db) {
        $this->db = $db;
    }

        public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getBrand() {
        return $this->brand;
    }

    public function setBrand($brand) {
        $this->brand = $brand;
    }

    public function getManufactureDate() {
        return $this->manufactureDate;
    }

    public function setManufactureDate($manufactureDate) {
        $this->manufactureDate = $manufactureDate;
    }

    public function getExpiryDate() {
        return $this->expiryDate;
    }

    public function setExpiryDate($expiryDate) {
        $this->expiryDate = $expiryDate;
    }

    public function getAmount() {
        return $this->amount;
    }

    public function setAmount($amount) {
        $this->amount = $amount;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setDescription($description) {
        $this->description = $description;
    }
}