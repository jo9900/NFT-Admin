export const scanHref = process.env.VUE_APP_TEST_SCAN
export const unit = 'USDT'
export const cooperationMail = 'nft@arthurex.com'
export const validatedMediaExt = {
  img: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  video: ['mp4', 'webm'],
  sound: ['mp3', 'wav'],
}
export const currentLocale = localStorage.getItem('locale') || 'en'
export const VUE_APP_RFC = process.env.VUE_APP_RFC
export const VUE_APP_MCA = process.env.VUE_APP_MCA
export const VUE_APP_NCA = process.env.VUE_APP_NCA
export const VUE_APP_PAYTOKEN = process.env.VUE_APP_PAYTOKEN
export const abi_USDT_Balance = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
export const abi_USDT_Approve = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const abi_USDT_Allowance = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
export const abi_Exchange = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'payToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'payAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
        ],
        internalType: 'struct Market.Order',
        name: 'order',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'exchange',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]
export const abi_Discontinued = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'payToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'payAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
        ],
        internalType: 'struct Market.Order',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const abi_Mint = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'royalties',
        type: 'uint256',
      },
    ],
    name: 'mint', // 铸造
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const abi_Approve = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve', // 授权
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
