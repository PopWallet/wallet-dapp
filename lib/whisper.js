import Web3 from 'web3'

class ShhRpc {
  constructor (url, topic) {
    this.params = {
      ttl: 300,
      priority: 1,
      powTarget: 2.01,
      powTime: 100
    }
    this.url      = url;
    this.topic    = topic;
    this.web3     = new Web3(url, null);
    this.symKeyID = null;
  }

  async post (message) {
    const symKeyID = this.symKeyID;
    const topic    = this.web3.utils.toHex(this.topic);
    const data     = JSON.stringify(message);
    const payload  = this.web3.utils.utf8ToHex(data);

    try {
      if (symKeyID && await this.web3.shh.hasSymKey(symKeyID)) {
        return this.web3.shh.post({ ...this.params, symKeyID, topic, payload });
      } else {
        throw -1;
      }
    } catch(e) {
      try {
        this.web3 = new Web3(this.url, null);
        this.symKeyID = await this.web3.shh.generateSymKeyFromPassword(this.topic);
        this.post(message);
      } catch(e) {
        return Promise.reject(e)
      }
    }
  }
}

export default ShhRpc;
