const fields = (obj, fillable = [], guarded = []) => {
    let data = {}
    for (let key in obj) {
        if ((fillable.length > 0 && fillable.includes(key)) || (guarded.length > 0 && !guarded.includes(key))) {
            data[key] = obj[key]
        }
    }
    // return data
    return obj;
}

const casts = (obj, casts = {}) => {
    // iterate through casts and set data type if exist
    for (let field in casts) {
        if (casts.hasOwnProperty(field) && obj[field] !== undefined) {
            switch (casts[field]) {
                case 'json':
                    obj[field] = JSON.parse(obj[field]);
                    break;
                case 'boolean':
                    obj[field] = Boolean(obj[field]);
                    break;
                case 'date':
                    obj[field] = new Date(obj[field]);
                    break;
                case 'number':
                    obj[field] = Number(obj[field]);
                    break;
                case 'string':
                    obj[field] = String(obj[field]);
                    break;
                case 'float':
                    obj[field] = parseFloat(obj[field]);
                    break;
            }
        }
    }
    return obj
}

module.exports = {
    fields,
    casts
}