const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Zoodo Medical Records Smart Contract Deployment...");
  
  // Get the contract factory
  const ZoodoMedicalRecords = await ethers.getContractFactory("ZoodoMedicalRecords");
  
  // Deploy the contract
  console.log("📝 Deploying ZoodoMedicalRecords contract...");
  const zoodoMedicalRecords = await ZoodoMedicalRecords.deploy();
  
  // Wait for deployment to complete
  await zoodoMedicalRecords.waitForDeployment();
  
  const contractAddress = await zoodoMedicalRecords.getAddress();
  
  console.log("✅ ZoodoMedicalRecords deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", network.name);
  console.log("⛽ Gas Used:", (await zoodoMedicalRecords.deploymentTransaction()).gasLimit.toString());
  
  // Verify deployment by calling a view function
  try {
    const totalRecords = await zoodoMedicalRecords.getTotalMedicalRecords();
    const totalAppointments = await zoodoMedicalRecords.getTotalAppointmentRecords();
    const stats = await zoodoMedicalRecords.getContractStats();
    
    console.log("\n📊 Contract Statistics:");
    console.log("   Total Medical Records:", totalRecords.toString());
    console.log("   Total Appointment Records:", totalAppointments.toString());
    console.log("   Contract Stats:", stats);
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Next Steps:");
    console.log("1. Update your .env file with the contract address:");
    console.log(`   BLOCKCHAIN_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("2. Update your backend configuration");
    console.log("3. Test the contract functionality");
    
  } catch (error) {
    console.error("❌ Error verifying deployment:", error.message);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
