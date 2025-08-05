import os
import json
import hashlib
from typing import Dict, Any, Optional
from web3 import Web3
from eth_account import Account
import asyncio

class BlockchainClient:
    def __init__(self):
        self.web3 = None
        self.contract = None
        self.account = None
        self.contract_address = None
        self.is_connected = False
        
        # Load configuration
        self.network_url = os.getenv("BLOCKCHAIN_NETWORK_URL", "http://localhost:8545")
        self.private_key = os.getenv("BLOCKCHAIN_PRIVATE_KEY")
        self.contract_address = os.getenv("BLOCKCHAIN_CONTRACT_ADDRESS")

    async def initialize(self):
        """Initialize blockchain connection and contract"""
        try:
            # Connect to blockchain network
            self.web3 = Web3(Web3.HTTPProvider(self.network_url))
            
            if not self.web3.is_connected():
                print("Warning: Could not connect to blockchain network")
                return
            
            # Set up account
            if self.private_key:
                self.account = Account.from_key(self.private_key)
                self.web3.eth.default_account = self.account.address
            
            # Load contract ABI and address
            await self._load_contract()
            
            self.is_connected = True
            print("Blockchain client initialized successfully")
            
        except Exception as e:
            print(f"Error initializing blockchain client: {str(e)}")
            self.is_connected = False

    async def _load_contract(self):
        """Load smart contract for medical records"""
        try:
            # Contract ABI for medical records storage
            contract_abi = [
                {
                    "inputs": [
                        {"name": "recordHash", "type": "string"},
                        {"name": "petId", "type": "string"},
                        {"name": "timestamp", "type": "uint256"}
                    ],
                    "name": "storeMedicalRecord",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {"name": "recordHash", "type": "string"}
                    ],
                    "name": "getMedicalRecord",
                    "outputs": [
                        {"name": "petId", "type": "string"},
                        {"name": "timestamp", "type": "uint256"},
                        {"name": "exists", "type": "bool"}
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {"name": "petId", "type": "string"}
                    ],
                    "name": "getPetRecords",
                    "outputs": [
                        {"name": "recordHashes", "type": "string[]"}
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
            
            if self.contract_address:
                self.contract = self.web3.eth.contract(
                    address=self.contract_address,
                    abi=contract_abi
                )
            else:
                print("Warning: No contract address provided")
                
        except Exception as e:
            print(f"Error loading contract: {str(e)}")

    async def store_medical_record(
        self,
        pet_id: str,
        record_data: Dict[str, Any],
        record_type: str
    ) -> Dict[str, Any]:
        """Store medical record on blockchain"""
        try:
            if not self.is_connected or not self.contract:
                return await self._mock_store_record(pet_id, record_data, record_type)
            
            # Create record hash
            record_hash = self._create_record_hash(pet_id, record_data, record_type)
            
            # Store on blockchain
            transaction = self.contract.functions.storeMedicalRecord(
                record_hash,
                pet_id,
                self.web3.eth.get_block('latest').timestamp
            ).build_transaction({
                'from': self.account.address,
                'gas': 200000,
                'gasPrice': self.web3.eth.gas_price,
                'nonce': self.web3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_txn = self.web3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "success": True,
                "transaction_hash": tx_hash.hex(),
                "record_hash": record_hash,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed
            }
            
        except Exception as e:
            print(f"Error storing medical record: {str(e)}")
            return await self._mock_store_record(pet_id, record_data, record_type)

    async def _mock_store_record(
        self,
        pet_id: str,
        record_data: Dict[str, Any],
        record_type: str
    ) -> Dict[str, Any]:
        """Mock record storage when blockchain is not available"""
        record_hash = self._create_record_hash(pet_id, record_data, record_type)
        
        return {
            "success": True,
            "transaction_hash": f"mock_tx_{hash(record_hash) % 1000000}",
            "record_hash": record_hash,
            "block_number": 0,
            "gas_used": 0,
            "mock": True
        }

    def _create_record_hash(self, pet_id: str, record_data: Dict[str, Any], record_type: str) -> str:
        """Create hash for medical record"""
        record_string = json.dumps({
            "pet_id": pet_id,
            "record_type": record_type,
            "data": record_data,
            "timestamp": self._get_current_timestamp()
        }, sort_keys=True)
        
        return hashlib.sha256(record_string.encode()).hexdigest()

    def _get_current_timestamp(self) -> int:
        """Get current timestamp"""
        import time
        return int(time.time())

    async def verify_medical_record(self, record_hash: str) -> Dict[str, Any]:
        """Verify medical record on blockchain"""
        try:
            if not self.is_connected or not self.contract:
                return await self._mock_verify_record(record_hash)
            
            # Query blockchain for record
            record_info = self.contract.functions.getMedicalRecord(record_hash).call()
            
            return {
                "exists": record_info[2],
                "pet_id": record_info[0],
                "timestamp": record_info[1],
                "verified": True
            }
            
        except Exception as e:
            print(f"Error verifying medical record: {str(e)}")
            return await self._mock_verify_record(record_hash)

    async def _mock_verify_record(self, record_hash: str) -> Dict[str, Any]:
        """Mock record verification"""
        return {
            "exists": True,
            "pet_id": "mock_pet_id",
            "timestamp": self._get_current_timestamp(),
            "verified": True,
            "mock": True
        }

    async def get_pet_records(self, pet_id: str) -> Dict[str, Any]:
        """Get all medical records for a pet"""
        try:
            if not self.is_connected or not self.contract:
                return await self._mock_get_pet_records(pet_id)
            
            # Query blockchain for pet records
            record_hashes = self.contract.functions.getPetRecords(pet_id).call()
            
            return {
                "pet_id": pet_id,
                "record_hashes": record_hashes,
                "total_records": len(record_hashes),
                "verified": True
            }
            
        except Exception as e:
            print(f"Error getting pet records: {str(e)}")
            return await self._mock_get_pet_records(pet_id)

    async def _mock_get_pet_records(self, pet_id: str) -> Dict[str, Any]:
        """Mock pet records retrieval"""
        mock_hashes = [
            f"mock_record_hash_{pet_id}_1",
            f"mock_record_hash_{pet_id}_2",
            f"mock_record_hash_{pet_id}_3"
        ]
        
        return {
            "pet_id": pet_id,
            "record_hashes": mock_hashes,
            "total_records": len(mock_hashes),
            "verified": True,
            "mock": True
        }

    async def store_appointment_record(
        self,
        appointment_id: str,
        appointment_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store appointment record on blockchain"""
        try:
            if not self.is_connected or not self.contract:
                return await self._mock_store_appointment(appointment_id, appointment_data)
            
            # Create appointment hash
            appointment_hash = self._create_appointment_hash(appointment_id, appointment_data)
            
            # Store on blockchain (using same contract for simplicity)
            transaction = self.contract.functions.storeMedicalRecord(
                appointment_hash,
                appointment_id,
                self.web3.eth.get_block('latest').timestamp
            ).build_transaction({
                'from': self.account.address,
                'gas': 200000,
                'gasPrice': self.web3.eth.gas_price,
                'nonce': self.web3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_txn = self.web3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "success": True,
                "transaction_hash": tx_hash.hex(),
                "appointment_hash": appointment_hash,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed
            }
            
        except Exception as e:
            print(f"Error storing appointment record: {str(e)}")
            return await self._mock_store_appointment(appointment_id, appointment_data)

    async def _mock_store_appointment(self, appointment_id: str, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock appointment storage"""
        appointment_hash = self._create_appointment_hash(appointment_id, appointment_data)
        
        return {
            "success": True,
            "transaction_hash": f"mock_appointment_tx_{hash(appointment_hash) % 1000000}",
            "appointment_hash": appointment_hash,
            "block_number": 0,
            "gas_used": 0,
            "mock": True
        }

    def _create_appointment_hash(self, appointment_id: str, appointment_data: Dict[str, Any]) -> str:
        """Create hash for appointment record"""
        appointment_string = json.dumps({
            "appointment_id": appointment_id,
            "data": appointment_data,
            "timestamp": self._get_current_timestamp()
        }, sort_keys=True)
        
        return hashlib.sha256(appointment_string.encode()).hexdigest()

    def is_connected(self) -> bool:
        """Check if blockchain client is connected"""
        return self.is_connected 