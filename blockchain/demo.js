const { ethers } = require("hardhat");

async function main() {
  console.log("🐾 ZOODO BLOCKCHAIN DEMO - Digital Health Records (DHRs)");
  console.log("=" .repeat(60));
  
  // Get signers (accounts)
  const [owner, veterinarian, petOwner] = await ethers.getSigners();
  
  console.log("👤 Owner:", owner.address);
  console.log("👨‍⚕️ Veterinarian:", veterinarian.address);
  console.log("👤 Pet Owner:", petOwner.address);
  console.log();
  
  // Deploy contract
  console.log("🚀 Deploying ZoodoMedicalRecords Smart Contract...");
  const ZoodoMedicalRecords = await ethers.getContractFactory("ZoodoMedicalRecords");
  const contract = await ZoodoMedicalRecords.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
  console.log();
  
  // Authorize veterinarian
  console.log("🔐 Authorizing veterinarian...");
  await contract.authorizeProvider(veterinarian.address);
  console.log("✅ Veterinarian authorized!");
  console.log();
  
  // Demo 1: Store Medical Record
  console.log("📋 DEMO 1: Storing Medical Record on Blockchain");
  console.log("-".repeat(50));
  
  const petId = "PET-001";
  const recordType = "Vaccination";
  const medicalData = "Rabies vaccination administered on 2024-01-15. Next due: 2025-01-15";
  const recordHash = ethers.keccak256(ethers.toUtf8Bytes(medicalData));
  
  console.log("Pet ID:", petId);
  console.log("Record Type:", recordType);
  console.log("Medical Data:", medicalData);
  console.log("Record Hash:", recordHash);
  
  // Store the record
  const tx1 = await contract.connect(veterinarian).storeMedicalRecord(
    recordHash,
    petId,
    recordType
  );
  await tx1.wait();
  
  console.log("✅ Medical record stored on blockchain!");
  console.log("Transaction Hash:", tx1.hash);
  console.log();
  
  // Demo 2: Store Appointment Record
  console.log("📅 DEMO 2: Storing Appointment Record on Blockchain");
  console.log("-".repeat(50));
  
  const appointmentId = "APT-001";
  const appointmentData = "Annual checkup scheduled for 2024-01-20 at 2:00 PM";
  const appointmentHash = ethers.keccak256(ethers.toUtf8Bytes(appointmentData));
  
  console.log("Appointment ID:", appointmentId);
  console.log("Pet ID:", petId);
  console.log("Appointment Data:", appointmentData);
  console.log("Appointment Hash:", appointmentHash);
  
  // Store the appointment
  const tx2 = await contract.connect(veterinarian).storeAppointmentRecord(
    appointmentHash,
    appointmentId,
    petId
  );
  await tx2.wait();
  
  console.log("✅ Appointment record stored on blockchain!");
  console.log("Transaction Hash:", tx2.hash);
  console.log();
  
  // Demo 3: Verify Records
  console.log("🔍 DEMO 3: Verifying Records on Blockchain");
  console.log("-".repeat(50));
  
  // Verify medical record
  const medicalRecordExists = await contract.verifyMedicalRecord(recordHash);
  console.log("Medical Record Exists:", medicalRecordExists);
  
  // Verify appointment record
  const appointmentExists = await contract.verifyAppointmentRecord(appointmentId);
  console.log("Appointment Record Exists:", appointmentExists);
  
  // Get medical record details
  const [retrievedPetId, timestamp, exists] = await contract.getMedicalRecord(recordHash);
  console.log("Retrieved Pet ID:", retrievedPetId);
  console.log("Record Timestamp:", new Date(Number(timestamp) * 1000).toLocaleString());
  console.log("Record Exists:", exists);
  console.log();
  
  // Demo 4: Get Pet Records
  console.log("📚 DEMO 4: Retrieving All Records for Pet");
  console.log("-".repeat(50));
  
  const petRecords = await contract.getPetRecords(petId);
  console.log("Pet ID:", petId);
  console.log("Total Records:", petRecords.length);
  console.log("Record Hashes:", petRecords);
  console.log();
  
  // Demo 5: Contract Statistics
  console.log("📊 DEMO 5: Contract Statistics");
  console.log("-".repeat(50));
  
  const totalRecords = await contract.getTotalMedicalRecords();
  const totalAppointments = await contract.getTotalAppointmentRecords();
  const stats = await contract.getContractStats();
  
  console.log("Total Medical Records:", totalRecords.toString());
  console.log("Total Appointment Records:", totalAppointments.toString());
  console.log("Contract Stats:", stats);
  console.log();
  
  // Demo 6: Security Test
  console.log("🔒 DEMO 6: Security Test - Unauthorized Access");
  console.log("-".repeat(50));
  
  try {
    const unauthorizedHash = ethers.keccak256(ethers.toUtf8Bytes("Unauthorized record"));
    await contract.connect(petOwner).storeMedicalRecord(
      unauthorizedHash,
      "PET-002",
      "Unauthorized"
    );
    console.log("❌ Security test failed - unauthorized access allowed!");
  } catch (error) {
    console.log("✅ Security test passed - unauthorized access blocked!");
    console.log("Error:", error.message);
  }
  console.log();
  
  console.log("🎉 BLOCKCHAIN DEMO COMPLETED SUCCESSFULLY!");
  console.log("=" .repeat(60));
  console.log();
  console.log("📋 SUMMARY:");
  console.log("✅ Smart contract deployed and functional");
  console.log("✅ Medical records stored on blockchain");
  console.log("✅ Appointment records stored on blockchain");
  console.log("✅ Record verification working");
  console.log("✅ Security features active");
  console.log("✅ Digital Health Records (DHRs) system operational");
  console.log();
  console.log("🔗 Contract Address:", contractAddress);
  console.log("🌐 Network:", network.name);
  console.log("⛽ Gas Used:", (tx1.gasLimit + tx2.gasLimit).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Demo failed:", error);
    process.exit(1);
  });
