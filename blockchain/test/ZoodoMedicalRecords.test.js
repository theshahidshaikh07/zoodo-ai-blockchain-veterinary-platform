const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZoodoMedicalRecords - Digital Health Records (DHRs)", function () {
  let zoodoMedicalRecords;
  let owner;
  let veterinarian;
  let petOwner;

  beforeEach(async function () {
    // Get signers
    [owner, veterinarian, petOwner] = await ethers.getSigners();
    
    // Deploy contract
    const ZoodoMedicalRecords = await ethers.getContractFactory("ZoodoMedicalRecords");
    zoodoMedicalRecords = await ZoodoMedicalRecords.deploy();
    await zoodoMedicalRecords.waitForDeployment();
  });

  describe("🏥 Digital Health Records (DHRs) - Basic Functionality", function () {
    it("Should deploy contract successfully", async function () {
      expect(await zoodoMedicalRecords.getAddress()).to.be.properAddress;
      console.log("✅ Contract deployed at:", await zoodoMedicalRecords.getAddress());
    });

    it("Should authorize veterinarian to store medical records", async function () {
      // Authorize veterinarian
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      // Check authorization
      const isAuthorized = await zoodoMedicalRecords.isAuthorizedProvider(veterinarian.address);
      expect(isAuthorized).to.be.true;
      console.log("✅ Veterinarian authorized:", veterinarian.address);
    });

    it("Should store a medical record on blockchain", async function () {
      // Authorize veterinarian
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      // Create a medical record hash (simulating real medical data)
      const petId = "PET-001";
      const recordType = "Vaccination";
      const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Rabies vaccination - 2024-01-15"));
      
      // Store medical record
      await zoodoMedicalRecords.connect(veterinarian).storeMedicalRecord(
        recordHash,
        petId,
        recordType
      );
      
      // Verify record exists
      const exists = await zoodoMedicalRecords.verifyMedicalRecord(recordHash);
      expect(exists).to.be.true;
      
      console.log("✅ Medical record stored:");
      console.log("   Pet ID:", petId);
      console.log("   Record Type:", recordType);
      console.log("   Record Hash:", recordHash);
    });

    it("Should store appointment record on blockchain", async function () {
      // Authorize veterinarian
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      // Create appointment data
      const appointmentId = "APT-001";
      const petId = "PET-001";
      const appointmentHash = ethers.keccak256(ethers.toUtf8Bytes("Annual checkup - 2024-01-20"));
      
      // Store appointment record
      await zoodoMedicalRecords.connect(veterinarian).storeAppointmentRecord(
        appointmentHash,
        appointmentId,
        petId
      );
      
      // Verify appointment exists
      const exists = await zoodoMedicalRecords.verifyAppointmentRecord(appointmentId);
      expect(exists).to.be.true;
      
      console.log("✅ Appointment record stored:");
      console.log("   Appointment ID:", appointmentId);
      console.log("   Pet ID:", petId);
      console.log("   Appointment Hash:", appointmentHash);
    });

    it("Should retrieve all records for a pet", async function () {
      // Authorize veterinarian
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      const petId = "PET-001";
      
      // Store multiple medical records
      const record1Hash = ethers.keccak256(ethers.toUtf8Bytes("Vaccination record 1"));
      const record2Hash = ethers.keccak256(ethers.toUtf8Bytes("Checkup record 1"));
      
      await zoodoMedicalRecords.connect(veterinarian).storeMedicalRecord(
        record1Hash,
        petId,
        "Vaccination"
      );
      
      await zoodoMedicalRecords.connect(veterinarian).storeMedicalRecord(
        record2Hash,
        petId,
        "Checkup"
      );
      
      // Get all records for pet
      const petRecords = await zoodoMedicalRecords.getPetRecords(petId);
      expect(petRecords.length).to.equal(2);
      
      console.log("✅ Pet records retrieved:");
      console.log("   Pet ID:", petId);
      console.log("   Total Records:", petRecords.length);
      console.log("   Record Hashes:", petRecords);
    });

    it("Should show contract statistics", async function () {
      // Authorize veterinarian
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      // Store some records
      const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
      const appointmentHash = ethers.keccak256(ethers.toUtf8Bytes("Test appointment"));
      
      await zoodoMedicalRecords.connect(veterinarian).storeMedicalRecord(
        recordHash,
        "PET-001",
        "Test"
      );
      
      await zoodoMedicalRecords.connect(veterinarian).storeAppointmentRecord(
        appointmentHash,
        "APT-001",
        "PET-001"
      );
      
      // Get statistics
      const totalRecords = await zoodoMedicalRecords.getTotalMedicalRecords();
      const totalAppointments = await zoodoMedicalRecords.getTotalAppointmentRecords();
      
      expect(totalRecords).to.equal(1);
      expect(totalAppointments).to.equal(1);
      
      console.log("📊 Contract Statistics:");
      console.log("   Total Medical Records:", totalRecords.toString());
      console.log("   Total Appointment Records:", totalAppointments.toString());
    });
  });

  describe("🔒 Security Features", function () {
    it("Should prevent unauthorized access", async function () {
      const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Unauthorized record"));
      
      // Try to store record without authorization
      await expect(
        zoodoMedicalRecords.connect(petOwner).storeMedicalRecord(
          recordHash,
          "PET-001",
          "Unauthorized"
        )
      ).to.be.revertedWith("Not authorized provider");
      
      console.log("✅ Unauthorized access prevented");
    });

    it("Should allow owner to pause contract", async function () {
      await zoodoMedicalRecords.pause();
      
      // Try to store record when paused
      await zoodoMedicalRecords.authorizeProvider(veterinarian.address);
      
      const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Paused record"));
      
      await expect(
        zoodoMedicalRecords.connect(veterinarian).storeMedicalRecord(
          recordHash,
          "PET-001",
          "Paused"
        )
      ).to.be.revertedWith("Pausable: paused");
      
      console.log("✅ Contract pause functionality works");
    });
  });
});
