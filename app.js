import './App.css';
import { Button, ButtonToolbar,ButtonGroup, Modal } from 'react-bootstrap';  
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import axios from 'axios';
import React, { Component } from 'react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import "sf-font";

const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_paytoken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_costvalue",
				"type": "uint256"
			}
		],
		"name": "addCurrency",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "mintpid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_state",
				"type": "bool"
			}
		],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newBaseExtension",
				"type": "string"
			}
		],
		"name": "setBaseExtension",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newBaseURI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newmaxMintAmount",
				"type": "uint256"
			}
		],
		"name": "setmaxMintAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "AllowedCrypto",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "paytoken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "costvalue",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseExtension",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "getCryptotoken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			}
		],
		"name": "getNFTCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxMintAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "walletOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const VAULTABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "NFTStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "NFTUnstaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "claimForAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract Collection",
				"name": "_nft",
				"type": "address"
			},
			{
				"internalType": "contract N2DRewards",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "earningInfo",
		"outputs": [
			{
				"internalType": "uint256[1]",
				"name": "info",
				"type": "uint256[1]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC721Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "tokensOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "ownerTokens",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalStaked",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "vault",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "tokenId",
				"type": "uint24"
			},
			{
				"internalType": "uint48",
				"name": "timestamp",
				"type": "uint48"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

var TOKENABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "controller",
				"type": "address"
			}
		],
		"name": "addController",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burnFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "controller",
				"type": "address"
			}
		],
		"name": "removeController",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

var account = null;
var contract = null;
var vaultcontract = null;
var web3 = null;

const NFTCONTRACT = "0xC6Ad2824B03275D4cC5E8f4f61c5a143b999717b";
const STAKINGCONTRACT = "0x60fEA9c2cFe8b44a9C7bf16dA54856CbfC290f13"
const polygonscanapikey = "DBQX5JUSAVUZRK8CC4IN2UZF9N2HA63P4U";
const polygonscanapi = "https://api-testnet.polygonscan.com/api"
const moralisapi = "https://deep-index.moralis.io/api/v2/";
const moralisapikey = "QlJv1SQwf47sxwKLY6Ut8M9sq9KI9q6MmrcEIMuNHiGF5lNKdSLfDmnACTO2rK2g";
const nftpng = "https://ipfs.io/ipfs/QmetESUb7wTPr8mBHWFsiSKMw6HTLWUGoL8DrkcaY9TTyh/";

const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: "3cf2d8833a2143b795b7796087fff369"
		}
	},
	walletlink: {
		package: WalletLink, 
		options: {
		  appName: "Net2Dev NFT Minter", 
		  infuraId: "3cf2d8833a2143b795b7796087fff369",
		  rpc: "", 
		  chainId: 4, 
		  appLogoUrl: null, 
		  darkMode: true 
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "rinkeby",
	theme: "dark",
	cacheProvider: true,
	providerOptions 
  });


class App extends Component {
	constructor() {
		super();
		this.state = {
			balance: [],
			nftdata: [],
		};
	}

	handleModal(){  
		this.setState({show:!this.state.show})  
	} 

	handleNFT(nftamount) {
		this.setState({outvalue:nftamount.target.value});
  	}

	async componentDidMount() {
		
		await axios.get((polygonscanapi + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${polygonscanapikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		await axios.get((moralisapi + `/nft/${NFTCONTRACT}/owners?chain=mumbai&format=decimal`), {headers: config})
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}
  
  render() {
	const {balance} = this.state;
	const {nftdata} = this.state;
	const {outvalue} = this.state;

	async function connectwallet() { 
		var provider = await web3Modal.connect();
		web3 = new Web3(provider); 
		await provider.send('eth_requestAccounts'); 
		var accounts = await web3.eth.getAccounts(); 
		account = accounts[0]; 
		document.getElementById('wallet-address').textContent = account; 
		contract = new web3.eth.Contract(ABI, NFTCONTRACT);
		vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
  }

  async function mint0() {
	  	  var _pid = "0";
		  var erc20address = await contract.methods.getCryptotoken(_pid).call();
		  var currency = new web3.eth.Contract(TOKENABI, erc20address);
		  var mintRate = await contract.methods.getNFTCost(_pid).call();
		  var _mintAmount = Number(outvalue);
		  var totalAmount = mintRate * _mintAmount;
		  currency.methods.approve(NFTCONTRACT, String(totalAmount)).send({from: account})
		  .then(
		  await currency.methods.transfer(NFTCONTRACT, String(totalAmount)).send({from:account}))
		  .then(
			contract.methods.mintpid(account, _mintAmount, _pid).send({from: account})
		  );
		}
  async function mint1() {
	  	  var _pid = "1";
		  var erc20address = await contract.methods.getCryptotoken(_pid).call();
		  var currency = new web3.eth.Contract(TOKENABI, erc20address);
		  var mintRate = await contract.methods.getNFTCost(_pid).call();
		  var _mintAmount = Number(outvalue);
		  var totalAmount = mintRate * _mintAmount;
		  currency.methods.approve(NFTCONTRACT, String(totalAmount)).send({from: account})
		  .then(
		  await currency.methods.transfer(NFTCONTRACT, String(totalAmount)).send({from:account}))
		  .then(
			contract.methods.mintpid(account, _mintAmount, _pid).send({from: account})
		  );
		}

  async function mint2() {
	  	  var _pid = "2";
		  var erc20address = await contract.methods.getCryptotoken(_pid).call();
		  var currency = new web3.eth.Contract(TOKENABI, erc20address);
		  var mintRate = await contract.methods.getNFTCost(_pid).call();
		  var _mintAmount = Number(outvalue);
		  var totalAmount = mintRate * _mintAmount;
		  currency.methods.approve(NFTCONTRACT, String(totalAmount)).send({from: account})
		  .then(
		  await currency.methods.transfer(NFTCONTRACT, String(totalAmount)).send({from:account}))
		  .then(
			contract.methods.mintpid(account, _mintAmount, _pid).send({from: account})
		  );
		}
  
		async function mint() {
			var _mintAmount = Number(outvalue);
			var mintRate = Number(await contract.methods.cost().call()); 
			var totalAmount = mintRate * _mintAmount; 
		  contract.methods.mint(account, _mintAmount).send({ from: account, value: String(totalAmount) }); 
		} 
  async function claimit() {
	  var tokenids = Number(document.querySelector("[name=stkid]").value);
	  vaultcontract.methods.claim([tokenids]).send({from: account});
  }
  
  async function verify() {
	  var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
	  document.getElementById('stakedbalance').textContent = getbalance; 
  }
  
  async function enable() {
	  contract.methods.setApprovalForAll(STAKINGCONTRACT, true).send({from: account});
	}

  async function rewardinfo() {
	 var tokenid = Number(document.querySelector("[name=stkid]").value);
	 var rawearn = await vaultcontract.methods.earningInfo(account, ([tokenid])).call();
	 var earned =  String(rawearn).split(",")[0];
	 var earnedrwd = Web3.utils.fromWei(earned);
	 var rewards = Number(earnedrwd).toFixed(2);
	 document.getElementById('earned').textContent = rewards;
   }

  return (
    <div className="App" style={{background:'black'}}>
		<Button onClick={enable}>Enable Staking</Button>
		<form class="gradient col-lg-3 mt-5 mr-3" style={{borderRadius:"25px",boxShadow:"1px 1px 15px #000000", marginRight:"5px"}}>
	<Button onClick={()=>this.handleModal()}>I Want My NFTs</Button>
  </form>
  <Modal  
	size="lg"
	className='border-0 d-flex'
	style={{backgroundColor:"#00000090"}}
	show={this.state.show} 
	onHide={()=>this.handleModal()}>
  <div className='container fluid'>
	<div className='row'>
		<div className='col'>
		  <Modal.Body className='modal-style col-12 border-0'>
			<div className="row">
			<div className="col mb-4">
			<Button className="btn mb-0" style={{backgroundColor:"#ffffff10"}} onClick={connectwallet}>Connect Your Wallet</Button>
				<h1 style={{fontWeight:"30"}}>NFT Minter</h1>
				<h3>{balance.result}/1000</h3>
				</div>
		<div className="col">
		<img src="art.png" className='mt-4 ml-4' width="240" height="240"/>
		</div>
		</div>
		<div className='row'>
		<div className='col xs={6} md={4}'>
		<h6 style={{fontSize:"20px"}}>Your Wallet Address</h6>
		<div className="" id='wallet-address' style={{
			  color: "#39FF14", 
			  textShadow:"1px 1px 1px black",
			  fontSize:"17px"
			  }}>
      	<label for="floatingInput">Please Connect Wallet</label>
		</div>
		</div>
		</div>
			  <div className='row'>
			  <label style={{fontWeight:"300", fontSize:"18px"}}>Select NFT Quantity</label>
			<ButtonToolbar aria-label="Toolbar">
  				<ButtonGroup size="lg" className="me-3 mb-2" 
				  aria-label="First group"
				  name="amount"
				  style={{boxShadow:"1px 1px 5px #000000"}}
				  onClick={nftamount => this.handleNFT(nftamount, "value")}
				>
    				<Button value="1">1</Button>
					<Button value="2">2</Button>
					<Button value="3">3</Button>
					<Button value="4">4</Button>
					<Button value="5">5</Button>
  				</ButtonGroup>
			</ButtonToolbar>
		  </div>
		  <div className="row mt-2">
		  <div className="col xs={10} md={8}">
		  <h6 style={{fontFamily:"SF Pro Display", fontWeight:"300", fontSize:"18px"}}>Buy with your preferred crypto!</h6>
		  <button style={{marginRight:"2px", backgroundColor:"transparent", border:"0.1"}} onClick={mint0}>
			<img src="n2dr-logo.png" width="90" height="90"/>
		 </button>
		 <button style={{marginRight:"2px", backgroundColor:"transparent", border:"1"}} onClick={mint1}>
			<img src="usdt.png" width="90" height="90"/>
		 </button>
		 <button style={{marginRight:"2px", backgroundColor:"transparent", border:"1"}} onClick={mint2}>
			<img src="ape.png" width="90" height="90"/>
		 </button>
		 <button style={{marginRight:"2px", backgroundColor:"transparent", border:"1"}} onClick={mint}>
			<img src="matic.png" width="90" height="90"/>
		 </button>
		</div>
		</div>
		<div class="root">
    <div class="header">
        <div className='mt-2' style={{fontSize:'20px', borderRadius:'14px'}}>N2DR NFT Staking Pools Active Rewards</div>
    </div>
	<table className='table table-bordered table-dark' style={{borderRadius:'14px'}} >
			<thead className='thead-light'>
    		<tr>
                <th scope="col">Collection</th>
      	 		<th scope="col">Rewards Per Day</th>
      			<th scope="col">Exchangeable Items</th>
    		</tr>
			</thead>
                <tbody>
                    <tr>
                        <td>N2D Bronze Collection</td>
                        <td class="amount" data-test-id="rewards-summary-ads">
                            <span class="amount">0.50</span>&nbsp;<span class="currency">N2DR</span>
                        </td>
                        <td class="exchange">
                            <span class="amount">2</span>&nbsp;<span class="currency">NFTs/M</span>
                        </td>
                    </tr>
                    <tr>
                        <td>N2D Silver Collection</td>
                        <td class="amount" data-test-id="rewards-summary-ac">
                            <span class="amount">2.50</span>&nbsp;<span class="currency">N2DR</span>
                        </td>
                        <td class="exchange"><span class="amount">10</span>&nbsp;<span class="currency">NFTs/M</span>
                        </td>
                    </tr>
                    <tr>
                        <td>N2D Gold Collection</td>
                        <td class="amount" data-test-id="rewards-summary-one-time"><span class="amount">1</span>&nbsp;<span class="currency">N2DR+</span>
                        </td>
                        <td class="exchange">
                            <span class="amount">25 NFTs/M or </span>
							<span class="currency">100 N2DR/M</span>
                        </td>
                    </tr>
                </tbody>
            </table>
			<div class="header">
        		<div className='mt-2' style={{fontSize:'20px', borderRadius:'14px'}}>N2DR Token Stake Farms</div>
    		</div>
			<table className='table table-bordered table-dark' style={{borderRadius:'14px'}} >
			<thead className='thead-light'>
    		<tr>
                <th scope="col">Farm Pools</th>
      	 		<th scope="col">Harvest Daily Earnings</th>
    		</tr>
			</thead>
                <tbody>
                    <tr>
                        <td>Stake N2DR to Earn N2DR</td>
                        <td class="amount" data-test-id="rewards-summary-ads">
                            <span class="amount">0.01</span>&nbsp;<span class="currency">Per N2DR</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Stake N2DR to Earn N2DR+</td>
                        <td class="amount" data-test-id="rewards-summary-ac">
                            <span class="amount">0.005</span>&nbsp;<span class="currency">Per N2DR</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
		  <div className="row mt-2">
		  <div className="col xs={12} md={12}">
            <Button style={{backgroundColor:"#ffffff10"}} className="mb-3"  onClick={()=>this.handleModal()}>Cancel</Button>  
			</div>
		</div>
		  </Modal.Body>
		  </div>
		  </div>
		  </div>
        </Modal> 
 <div className='container'>
<div className='row'>
  <form class="gradient col-lg-3 mt-5 mr-3" style={{borderRadius:"25px",boxShadow:"1px 1px 15px #000000", marginRight:"5px"}}>
    <h4 style={{color:"#FFFFFF"}}>Staking Vault</h4>
	<h5 style={{color:"#FFFFFF"}}>Verify Amount Staked</h5>
	<Button onClick={verify}>Verify</Button>
	<div id='stakedbalance' style={{marginTop:"5px",color:"#39FF14",fontWeight:"bold",textShadow:"1px 1px 2px #000000", fontSize:"35px" }}>
      <label for="floatingInput">NFT Balance</label>
      </div>
  </form>
  <form class="gradient col-lg-3 mt-5 mr-3" style={{borderRadius:"25px",boxShadow:"1px 1px 15px #000000", marginRight:"5px"}}>
  <h5 style={{color:"#FFFFFF"}}> Staking Rewards</h5>
	<Button onClick={rewardinfo}>Earned N2D Rewards</Button>
	<div id='earned' style={{color: "#39FF14",marginTop:"5px", fontSize:'25px',fontWeight:'bold',textShadow:"1px 1px 2px #000000"}}><p style={{fontSize:"20px"}}>Earned Tokens</p></div>
	<input name="stkid" style={{color: "#39FF14",fontSize:'25px',fontWeight:'bold',textShadow:"1px 1px 2px #000000",width:'50px',backgroundColor:'#00000000'}}/>
	<label className="col-4" style={{color:'white'}}>NFT ID</label>
	<div className='col-12 mt-2'>
      <div style={{color:'white'}}>Claim Rewards</div>
      <Button className="mb-2" onClick={claimit}>Claim</Button>
    </div>
  </form>
  <div className="row items mt-3">
  <div className="ml-3 mr-3" style={{display: "inline-grid",gridTemplateColumns: "repeat(4, 5fr)",columnGap: "10px"}}>
  {nftdata.map((result, i )=> {
	    	async function stakeit() {
			vaultcontract.methods.stake([result.token_id]).send({from: account});
		  	}
		  	async function unstakeit() {
			vaultcontract.methods.unstake([result.token_id]).send({from: account});
		  	}
	  return (
			<div className="card mt-3" key={i} >
            		<div className="image-over">
					<img className="card-img-top"  src={nftpng + result.token_id +'.png'} alt="" />
					</div>
					<div className="card-caption col-12 p-0">
                    	<div className="card-body">
							<h5 className="mb-0">Net2Dev Collection NFT #{result.token_id}</h5>
							<h5 className="mb-0 mt-2">Location Status<p style={{color:"#39FF14",fontWeight:"bold",textShadow:"1px 1px 2px #000000"}}>{result.owner_of}</p></h5>
                    	<div className="card-bottom d-flex justify-content-between">
						<input key={i} type="hidden" id='stakeid' value={result.token_id} />
							<Button className="mb-2 mt-3 col-5" style={{marginLeft:'2px'}} onClick={stakeit}>Stake it</Button>
							<Button className="mb-2 mt-3 col-5" style={{marginLeft:'2px'}} onClick={unstakeit}>Unstake it</Button>
							</div>
					</div>
                </div>
            </div>
        );
    })}
	</div>
</div>
  </div>
	</div>
 	</div>
  			);
	};
}

export default App;
