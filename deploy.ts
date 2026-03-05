// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VoteOnChain - Secure On-Chain Voting System
 * @notice Immutable, transparent, and tamper-proof voting on blockchain
 * @dev Designed for DogeOS L2, compatible with any EVM chain
 * @author VoteOnChain Team
 */

import "./VoterRegistry.sol";

contract VoteOnChain {
    // ============ Enums ============
    enum VoteType { YES_NO, MULTIPLE_CHOICE, MULTIPLE_SELECTION }
    enum ElectionStatus { ACTIVE, PAUSED, ENDED }

    // ============ Structs ============
    struct Election {
        uint256 id;
        string title;
        string description;
        VoteType voteType;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        address creator;
        uint256 totalVotes;
        bool exists;
    }

    struct Vote {
        address voter;
        uint256 electionId;
        uint256[] selectedOptions; // For YES_NO: 0=No, 1=Yes
        uint256 timestamp;
        bytes32 voteHash; // Hash for verification without revealing vote
    }

    // ============ State Variables ============
    VoterRegistry public voterRegistry;
    address public admin;
    uint256 public electionCount;
    uint256 public totalVotesCast;

    // Mappings
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => uint256)) public voteCounts; // electionId => optionIndex => count
    mapping(uint256 => mapping(address => bool)) public hasVoted; // electionId => voter => voted
    mapping(uint256 => Vote[]) private electionVotes; // electionId => votes (private for privacy)
    mapping(uint256 => address[]) public electionVoters; // electionId => voters (public audit trail)

    // ============ Events ============
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        VoteType voteType,
        uint256 startTime,
        uint256 endTime,
        address indexed creator
    );

    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        bytes32 voteHash,
        uint256 timestamp
    );

    event ElectionStatusChanged(
        uint256 indexed electionId,
        ElectionStatus newStatus
    );

    event VoterRegistryUpdated(address indexed newRegistry);

    // ============ Modifiers ============
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifiedVoter() {
        require(
            voterRegistry.isVerified(msg.sender),
            "Voter not verified - complete ID verification first"
        );
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(elections[_electionId].exists, "Election does not exist");
        _;
    }

    modifier electionActive(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(election.exists, "Election does not exist");
        require(election.status == ElectionStatus.ACTIVE, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }

    // ============ Constructor ============
    constructor(address _voterRegistry) {
        admin = msg.sender;
        voterRegistry = VoterRegistry(_voterRegistry);
        electionCount = 0;
        totalVotesCast = 0;
    }

    // ============ Admin Functions ============

    /**
     * @notice Create a new election
     * @param _title Election title
     * @param _description Election description
     * @param _voteType Type of vote (YES_NO, MULTIPLE_CHOICE, MULTIPLE_SELECTION)
     * @param _options Array of voting options
     * @param _startTime Unix timestamp when voting starts
     * @param _endTime Unix timestamp when voting ends
     */
    function createElection(
        string memory _title,
        string memory _description,
        VoteType _voteType,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_endTime > _startTime, "End time must be after start time");
        
        if (_voteType == VoteType.YES_NO) {
            require(_options.length == 0 || _options.length == 2, "YES_NO requires 0 or 2 options");
        } else {
            require(_options.length >= 2, "Need at least 2 options");
        }

        electionCount++;
        uint256 newElectionId = electionCount;

        // For YES_NO, set default options if not provided
        string[] memory finalOptions;
        if (_voteType == VoteType.YES_NO && _options.length == 0) {
            finalOptions = new string[](2);
            finalOptions[0] = "No";
            finalOptions[1] = "Yes";
        } else {
            finalOptions = _options;
        }

        elections[newElectionId] = Election({
            id: newElectionId,
            title: _title,
            description: _description,
            voteType: _voteType,
            options: finalOptions,
            startTime: _startTime,
            endTime: _endTime,
            status: ElectionStatus.ACTIVE,
            creator: msg.sender,
            totalVotes: 0,
            exists: true
        });

        emit ElectionCreated(
            newElectionId,
            _title,
            _voteType,
            _startTime,
            _endTime,
            msg.sender
        );

        return newElectionId;
    }

    /**
     * @notice Update election status (pause, resume, end)
     * @param _electionId Election ID
     * @param _status New status
     */
    function setElectionStatus(uint256 _electionId, ElectionStatus _status)
        external
        onlyAdmin
        electionExists(_electionId)
    {
        elections[_electionId].status = _status;
        emit ElectionStatusChanged(_electionId, _status);
    }

    /**
     * @notice Update voter registry contract address
     * @param _newRegistry New VoterRegistry contract address
     */
    function setVoterRegistry(address _newRegistry) external onlyAdmin {
        require(_newRegistry != address(0), "Invalid registry address");
        voterRegistry = VoterRegistry(_newRegistry);
        emit VoterRegistryUpdated(_newRegistry);
    }

    /**
     * @notice Transfer admin rights
     * @param _newAdmin New admin address
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }

    // ============ Voting Functions ============

    /**
     * @notice Cast a vote in an election
     * @param _electionId Election ID
     * @param _selectedOptions Array of selected option indices
     */
    function castVote(uint256 _electionId, uint256[] memory _selectedOptions)
        external
        onlyVerifiedVoter
        electionActive(_electionId)
    {
        require(!hasVoted[_electionId][msg.sender], "Already voted in this election");
        require(_selectedOptions.length > 0, "Must select at least one option");

        Election storage election = elections[_electionId];

        // Validate vote based on type
        if (election.voteType == VoteType.YES_NO || election.voteType == VoteType.MULTIPLE_CHOICE) {
            require(_selectedOptions.length == 1, "Can only select one option");
            require(_selectedOptions[0] < election.options.length, "Invalid option");
        } else if (election.voteType == VoteType.MULTIPLE_SELECTION) {
            for (uint256 i = 0; i < _selectedOptions.length; i++) {
                require(_selectedOptions[i] < election.options.length, "Invalid option");
                // Check for duplicates
                for (uint256 j = i + 1; j < _selectedOptions.length; j++) {
                    require(_selectedOptions[i] != _selectedOptions[j], "Duplicate options");
                }
            }
        }

        // Create vote hash for verification (without revealing actual vote)
        bytes32 voteHash = keccak256(
            abi.encodePacked(
                msg.sender,
                _electionId,
                _selectedOptions,
                block.timestamp,
                blockhash(block.number - 1)
            )
        );

        // Record vote
        Vote memory newVote = Vote({
            voter: msg.sender,
            electionId: _electionId,
            selectedOptions: _selectedOptions,
            timestamp: block.timestamp,
            voteHash: voteHash
        });

        electionVotes[_electionId].push(newVote);
        electionVoters[_electionId].push(msg.sender);
        hasVoted[_electionId][msg.sender] = true;

        // Update vote counts
        for (uint256 i = 0; i < _selectedOptions.length; i++) {
            voteCounts[_electionId][_selectedOptions[i]]++;
        }

        election.totalVotes++;
        totalVotesCast++;

        emit VoteCast(_electionId, msg.sender, voteHash, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @notice Get election details
     * @param _electionId Election ID
     */
    function getElection(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (
            string memory title,
            string memory description,
            VoteType voteType,
            string[] memory options,
            uint256 startTime,
            uint256 endTime,
            ElectionStatus status,
            uint256 totalVotes
        )
    {
        Election storage election = elections[_electionId];
        return (
            election.title,
            election.description,
            election.voteType,
            election.options,
            election.startTime,
            election.endTime,
            election.status,
            election.totalVotes
        );
    }

    /**
     * @notice Get vote counts for an election
     * @param _electionId Election ID
     */
    function getResults(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (uint256[] memory counts, uint256 total)
    {
        Election storage election = elections[_electionId];
        uint256[] memory results = new uint256[](election.options.length);
        
        for (uint256 i = 0; i < election.options.length; i++) {
            results[i] = voteCounts[_electionId][i];
        }
        
        return (results, election.totalVotes);
    }

    /**
     * @notice Get audit trail (who voted, not what they voted)
     * @param _electionId Election ID
     */
    function getAuditTrail(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (address[] memory voters)
    {
        return electionVoters[_electionId];
    }

    /**
     * @notice Check if address has voted in election
     * @param _electionId Election ID
     * @param _voter Voter address
     */
    function checkVoted(uint256 _electionId, address _voter)
        external
        view
        returns (bool)
    {
        return hasVoted[_electionId][_voter];
    }

    /**
     * @notice Get all active elections
     */
    function getActiveElections() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active elections
        for (uint256 i = 1; i <= electionCount; i++) {
            if (elections[i].status == ElectionStatus.ACTIVE &&
                block.timestamp >= elections[i].startTime &&
                block.timestamp <= elections[i].endTime) {
                activeCount++;
            }
        }
        
        // Build array of active election IDs
        uint256[] memory activeIds = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= electionCount; i++) {
            if (elections[i].status == ElectionStatus.ACTIVE &&
                block.timestamp >= elections[i].startTime &&
                block.timestamp <= elections[i].endTime) {
                activeIds[index] = i;
                index++;
            }
        }
        
        return activeIds;
    }

    /**
     * @notice Get contract statistics
     */
    function getStats()
        external
        view
        returns (
            uint256 totalElections,
            uint256 totalVotes,
            uint256 verifiedVoters
        )
    {
        return (
            electionCount,
            totalVotesCast,
            voterRegistry.verifiedVoterCount()
        );
    }
}
