import axios from 'axios'

class DeepBCApi {
    constructor() {
        this.baseurl = 'http://101.6.5.216:18000'
    }

    malignancyPred(images, bbox) {
        const formData = new FormData();
        
        for(var x = 0; x < images.length; x++) {
            formData.append('image_files', images[x])
        }
        formData.append('bbox', bbox)
        
        return axios.post(this.baseurl + '/diagnose/malignancy', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
    }
}

const deepBCApi = new DeepBCApi()
export default deepBCApi;