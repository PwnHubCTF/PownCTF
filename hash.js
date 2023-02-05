let flag = "PWNME{je_suis_un_flag}"
let secret = "71dcb815-24bc-468a-a7a3-ca70128e9864"

let hash = require('crypto').createHash('sha256').update(`${flag}${secret}`, 'utf8').digest('hex')


userflag = `${flag.slice(0, -1)}_${hash.slice(0,2)}}`


console.log(userflag);