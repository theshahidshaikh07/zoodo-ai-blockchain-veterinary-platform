// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ZoodoMedicalRecords
 * @dev Smart contract for storing and managing pet medical records on blockchain
 * Provides secure, immutable storage of medical records with access control
 */
contract ZoodoMedicalRecords is Ownable, Pausable {
    using Counters for Counters.Counter;
    
    // Structs
    struct MedicalRecord {
        string petId;
        string recordType;
        uint256 timestamp;
        string recordHash;
        address createdBy;
        bool exists;
    }
    
    struct PetRecord {
        string petId;
        string[] recordHashes;
        uint256 totalRecords;
        bool exists;
    }
    
    struct AppointmentRecord {
        string appointmentId;
        string petId;
        uint256 timestamp;
        string appointmentHash;
        address createdBy;
        bool exists;
    }
    
    // State variables
    Counters.Counter private _recordCounter;
    Counters.Counter private _appointmentCounter;
    
    // Mappings
    mapping(string => MedicalRecord) public medicalRecords; // recordHash => MedicalRecord
    mapping(string => PetRecord) public petRecords; // petId => PetRecord
    mapping(string => AppointmentRecord) public appointmentRecords; // appointmentId => AppointmentRecord
    mapping(address => bool) public authorizedProviders; // provider address => authorized
    mapping(address => string[]) public providerRecords; // provider address => record hashes
    
    // Events
    event MedicalRecordStored(
        string indexed petId,
        string recordHash,
        string recordType,
        uint256 timestamp,
        address indexed createdBy
    );
    
    event AppointmentRecordStored(
        string indexed appointmentId,
        string indexed petId,
        string appointmentHash,
        uint256 timestamp,
        address indexed createdBy
    );
    
    event ProviderAuthorized(address indexed provider, uint256 timestamp);
    event ProviderRevoked(address indexed provider, uint256 timestamp);
    event RecordVerified(string indexed recordHash, bool verified, uint256 timestamp);
    
    // Modifiers
    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender] || msg.sender == owner(), "Not authorized provider");
        _;
    }
    
    modifier recordExists(string memory recordHash) {
        require(medicalRecords[recordHash].exists, "Record does not exist");
        _;
    }
    
    modifier appointmentExists(string memory appointmentId) {
        require(appointmentRecords[appointmentId].exists, "Appointment does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        // Initialize with owner as authorized provider
        authorizedProviders[msg.sender] = true;
        emit ProviderAuthorized(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Store a medical record on the blockchain
     * @param recordHash Hash of the medical record data
     * @param petId ID of the pet
     * @param recordType Type of medical record (vaccination, checkup, etc.)
     */
    function storeMedicalRecord(
        string memory recordHash,
        string memory petId,
        string memory recordType
    ) external onlyAuthorizedProvider whenNotPaused {
        require(bytes(recordHash).length > 0, "Record hash cannot be empty");
        require(bytes(petId).length > 0, "Pet ID cannot be empty");
        require(!medicalRecords[recordHash].exists, "Record already exists");
        
        // Create medical record
        MedicalRecord memory newRecord = MedicalRecord({
            petId: petId,
            recordType: recordType,
            timestamp: block.timestamp,
            recordHash: recordHash,
            createdBy: msg.sender,
            exists: true
        });
        
        medicalRecords[recordHash] = newRecord;
        
        // Update pet records
        if (!petRecords[petId].exists) {
            petRecords[petId] = PetRecord({
                petId: petId,
                recordHashes: new string[](0),
                totalRecords: 0,
                exists: true
            });
        }
        
        petRecords[petId].recordHashes.push(recordHash);
        petRecords[petId].totalRecords++;
        
        // Update provider records
        providerRecords[msg.sender].push(recordHash);
        
        _recordCounter.increment();
        
        emit MedicalRecordStored(petId, recordHash, recordType, block.timestamp, msg.sender);
    }
    
    /**
     * @dev Store an appointment record on the blockchain
     * @param appointmentHash Hash of the appointment data
     * @param appointmentId ID of the appointment
     * @param petId ID of the pet
     */
    function storeAppointmentRecord(
        string memory appointmentHash,
        string memory appointmentId,
        string memory petId
    ) external onlyAuthorizedProvider whenNotPaused {
        require(bytes(appointmentHash).length > 0, "Appointment hash cannot be empty");
        require(bytes(appointmentId).length > 0, "Appointment ID cannot be empty");
        require(!appointmentRecords[appointmentId].exists, "Appointment already exists");
        
        // Create appointment record
        AppointmentRecord memory newAppointment = AppointmentRecord({
            appointmentId: appointmentId,
            petId: petId,
            timestamp: block.timestamp,
            appointmentHash: appointmentHash,
            createdBy: msg.sender,
            exists: true
        });
        
        appointmentRecords[appointmentId] = newAppointment;
        
        _appointmentCounter.increment();
        
        emit AppointmentRecordStored(appointmentId, petId, appointmentHash, block.timestamp, msg.sender);
    }
    
    /**
     * @dev Get medical record information
     * @param recordHash Hash of the medical record
     * @return petId, timestamp, exists status
     */
    function getMedicalRecord(string memory recordHash) 
        external 
        view 
        recordExists(recordHash)
        returns (string memory petId, uint256 timestamp, bool exists) 
    {
        MedicalRecord memory record = medicalRecords[recordHash];
        return (record.petId, record.timestamp, record.exists);
    }
    
    /**
     * @dev Get all medical records for a pet
     * @param petId ID of the pet
     * @return Array of record hashes
     */
    function getPetRecords(string memory petId) 
        external 
        view 
        returns (string[] memory) 
    {
        require(petRecords[petId].exists, "Pet records do not exist");
        return petRecords[petId].recordHashes;
    }
    
    /**
     * @dev Get appointment record information
     * @param appointmentId ID of the appointment
     * @return petId, timestamp, appointmentHash, exists status
     */
    function getAppointmentRecord(string memory appointmentId) 
        external 
        view 
        appointmentExists(appointmentId)
        returns (string memory petId, uint256 timestamp, string memory appointmentHash, bool exists) 
    {
        AppointmentRecord memory appointment = appointmentRecords[appointmentId];
        return (appointment.petId, appointment.timestamp, appointment.appointmentHash, appointment.exists);
    }
    
    /**
     * @dev Verify if a medical record exists
     * @param recordHash Hash of the medical record
     * @return True if record exists
     */
    function verifyMedicalRecord(string memory recordHash) external view returns (bool) {
        return medicalRecords[recordHash].exists;
    }
    
    /**
     * @dev Verify if an appointment record exists
     * @param appointmentId ID of the appointment
     * @return True if appointment exists
     */
    function verifyAppointmentRecord(string memory appointmentId) external view returns (bool) {
        return appointmentRecords[appointmentId].exists;
    }
    
    /**
     * @dev Authorize a provider to store records
     * @param provider Address of the provider to authorize
     */
    function authorizeProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider address");
        require(!authorizedProviders[provider], "Provider already authorized");
        
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider, block.timestamp);
    }
    
    /**
     * @dev Revoke provider authorization
     * @param provider Address of the provider to revoke
     */
    function revokeProvider(address provider) external onlyOwner {
        require(authorizedProviders[provider], "Provider not authorized");
        
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider, block.timestamp);
    }
    
    /**
     * @dev Get total number of medical records
     * @return Total count
     */
    function getTotalMedicalRecords() external view returns (uint256) {
        return _recordCounter.current();
    }
    
    /**
     * @dev Get total number of appointment records
     * @return Total count
     */
    function getTotalAppointmentRecords() external view returns (uint256) {
        return _appointmentCounter.current();
    }
    
    /**
     * @dev Get records created by a specific provider
     * @param provider Address of the provider
     * @return Array of record hashes
     */
    function getProviderRecords(address provider) external view returns (string[] memory) {
        return providerRecords[provider];
    }
    
    /**
     * @dev Check if address is authorized provider
     * @param provider Address to check
     * @return True if authorized
     */
    function isAuthorizedProvider(address provider) external view returns (bool) {
        return authorizedProviders[provider];
    }
    
    /**
     * @dev Pause contract operations (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract statistics
     * @return totalRecords, totalAppointments, authorizedProvidersCount
     */
    function getContractStats() external view returns (uint256 totalRecords, uint256 totalAppointments, uint256 authorizedProvidersCount) {
        // Note: This is a simplified implementation
        // In a real contract, you'd maintain a count of authorized providers
        return (_recordCounter.current(), _appointmentCounter.current(), 0);
    }
} 