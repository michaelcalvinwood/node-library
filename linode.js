require('dotenv').config();
const linodeToken = process.env.LINODE_TOKEN;
const publicKey = process.env.PUBLIC_KEY;
console.log(publicKey);

const axios = require('axios');

const prettyJSON = obj => {
    return JSON.stringify(obj, null, 4);
}

const show = obj => {
    console.log(prettyJSON(obj));
}

const linodeGet = (url, params = {}) => {
    let request = {
        url,
        params,
        method: 'get',
        headers: {
            Authorization: `Bearer ${linodeToken}`
        }
    };
    return new Promise((resolve, reject) => {
        axios(request)
        .then(response => resolve(response.data))
        .catch(error => {
            console.error(error);
            reject(error);}
        );
    });
}

const linodePost = async (url, params) => {
    let request = {
        url,
        method: 'post',
        data: params,
        headers: {
            Authorization: `Bearer ${linodeToken}`
        }
    }
    request.headers['Content-Type'] = 'application/json';

    return new Promise((resolve, reject) => {
        axios(request)
        .then(response => resolve(response.data))
        .catch(error => {
            console.error(error);
            reject(error);
        }    
        );

    })   
}

const linodeAccountView = async () => {
    return await linodeGet('https://api.linode.com/v4/account');
}

const linodeRegionsList = async () => {
    return await linodeGet(' https://api.linode.com/v4/regions');
}

const linodeList = async (page = 1, page_size = 100) => {
    return await linodeGet('https://api.linode.com/v4/linode/instances', {
        page,
        page_size
    })
}

const linodeImages = async () => {
    return await linodeGet('https://api.linode.com/v4/images');
}

// returns linode types sorted cheapest to most expensive
const linodeTypes = async () => {
    let types = await linodeGet('https://api.linode.com/v4/linode/types');

    let { data } = types;

    return data.sort((a, b) => a.price.monthly = b.price.monthly);
}

const linodeCreateInstance = async params => {
    return await linodePost('https://api.linode.com/v4/linode/instances', params);
}

const linodeDeleteInstance = id => {
    let request = {
        url: `https://api.linode.com/v4/linode/instances/${id}`,
        method: 'delete',
        headers: {
            Authorization: `Bearer ${linodeToken}`
        }
    }
    
    return new Promise((resolve, reject) => {
        axios(request)
        .then(response => resolve(response.data))
        .catch(error => {
            console.error(error);
            reject(error);
        })
    })
}

const showImages = async () => {
    let images = await linodeImages();
    let info = images.data.map(image => {
        let data = {};
        data.id = image.id;
        data.deprecated = image.deprecated;
        return data;
    })
    show (info);
    
}

const test = async () => {
    let deleteInfo = await linodeDeleteInstance('38986936');
    show(deleteInfo);
    
    return;

    let instanceTypes = await linodeTypes();
    
    let newLinode = await linodeCreateInstance({
        image: 'linode/ubuntu20.04',
        authorized_keys: [publicKey],
        backups_enabled: false,
        label: 'test-linode',
        private_ip: false,
        region: 'us-east',
        root_pass: 'simpleTest123',
        type: instanceTypes[0].id

    });
    
    show(newLinode);

}

try {
    test();
} catch (e) {
    console.error(e);
}